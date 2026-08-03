import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

interface ConferenceLite {
  id: string;
  name: string;
  description: string;
  categories: string[];
  isExternalOnly: boolean;
  websiteUrl: string;
}

interface ChatMessage {
  from: 'bot' | 'user';
  text?: string;
  results?: ConferenceLite[];
  // ⭐ חדש: כשמוגדר, ההודעה מציגה קישור יחיד לעמוד רשימת הכנסים
  // המסונן לפי הקטגוריה הזו - במקום כרטיסים בודדים עם הגבלת כמות
  categoryLink?: string;
}

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements OnInit {
  isOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];
  hasUnread = false;

  private allConferences: ConferenceLite[] = [];

  // ⭐ אותה רשימת קטגוריות קבועה שכבר קיימת בטופס הניהול/עמוד הכנסים,
  // כדי שהצ'אטבוט יציע בדיוק את אותן אפשרויות מהירות ללחיצה
  readonly categories = [
    'Humanities and Arts',
    'Social Sciences & Law',
    'BioMed',
    'Engineering',
    'Exact Sciences'
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.messages.push({
      from: 'bot',
      text: "Hi! I can help you find the right conference and get you to registration. Pick a field below, or just type what you're interested in."
    });
    this.hasUnread = true;

    // ⭐ טוענים את רשימת הכנסים פעם אחת בטעינת הווידג'ט - כל ההתאמות
    // (לפי קטגוריה או מילות מפתח) קורות מקומית על הרשימה הזו, בלי
    // שום קריאת API נוספת בכל הודעה
    this.apiService.getAllConferences().subscribe({
      next: (data: any[]) => {
        this.allConferences = (data || []).map((c: any) => {
          const cats = c.Categories || c.categories
            || (c.Category || c.category ? [c.Category || c.category] : []);
          return {
            id: c.Id || c._id || c.id,
            name: c.Name || c.name || c.Conference || c.conference || 'Unnamed Conference',
            description: c.Description || c.description || '',
            categories: Array.isArray(cats) ? cats : [],
            isExternalOnly: c.IsExternalOnly === true || c.isExternalOnly === true,
            websiteUrl: c.Links?.website || c.links?.website || ''
          };
        });
      },
      error: (err) => console.error('Chat widget: failed to load conferences', err)
    });
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.hasUnread = false;
  }

  // ⭐ תוקן: לחיצה על קטגוריה כבר לא מציגה כרטיסים בודדים (שהיו מוגבלים
  // ל-5 גם כשהיו יותר כנסים בקטגוריה) - עכשיו מציגה קישור יחיד לעמוד
  // רשימת הכנסים המלאה, מסונן מראש לפי אותה קטגוריה
  selectCategory(category: string): void {
    this.messages.push({ from: 'user', text: category });

    const count = this.allConferences.filter(c => c.categories.includes(category)).length;

    if (count === 0) {
      this.messages.push({
        from: 'bot',
        text: `I couldn't find any conferences in ${category} yet.`
      });
      return;
    }

    this.messages.push({
      from: 'bot',
      text: `There ${count === 1 ? 'is' : 'are'} ${count} conference${count === 1 ? '' : 's'} in ${category}. See them all:`,
      categoryLink: category
    });
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ from: 'user', text });
    this.userInput = '';

    // ⭐ תוקן: הוסר החיפוש בתוך ה-Description לגמרי, כי הוא יצר false
    // positives מטורפים - למשל "ran" נתפס בתוך "T-RAN-slational Medicine",
    // וגם בתוך פסקאות תיאור ארוכות של כנסים שלגמרי לא קשורים לחיפוש.
    // עכשיו בודקים רק שם + קטגוריה, ורק כהתאמת מילה שלמה (word boundary),
    // לא כתת-מחרוזת בתוך מילה אחרת.
    const matches = this.allConferences.filter(c =>
      this.matchesWholeWord(c.name, text) ||
      c.categories.some(cat => this.matchesWholeWord(cat, text))
    );

    this.respondWithMatches(matches, text);
  }

  // ⭐ חדש: בודק שה-term מופיע כמילה שלמה בתוך haystack (עם \b בשני
  // הצדדים), לא כרצף אותיות שנתפס בטעות בתוך מילה ארוכה יותר
  private matchesWholeWord(haystack: string, term: string): boolean {
    const escaped = term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!escaped) return false;
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(haystack);
  }

  private respondWithMatches(matches: ConferenceLite[], term: string): void {
    if (matches.length === 0) {
      this.messages.push({
        from: 'bot',
        text: `I couldn't find a conference matching "${term}". Try a different topic, or pick a category above.`
      });
      return;
    }

    this.messages.push({
      from: 'bot',
      text: `Here's what I found for "${term}":`,
      // מגבילים ל-5 תוצאות כדי לא להציף את החלון הקטן של הצ'אט
      results: matches.slice(0, 5)
    });
  }
}