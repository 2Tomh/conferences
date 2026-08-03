import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

interface ConferenceLite {
  id: string;
  name: string;
  description: string;
  categories: string[];
  isExternalOnly: boolean;
  websiteUrl: string;
  registrationDeadline: string;
  abstractDeadline: string;
  contactName: string;
  contactEmail: string;
}

interface ChatMessage {
  from: 'bot' | 'user';
  text?: string;
  results?: ConferenceLite[];
  categoryLink?: string;
  registerLink?: string;
  showBrowseButton?: boolean;
}

const TEXT = {
  headerTitle: 'Conference Assistant',
  greeting: "Hi! I can help you find the right conference, register, get in touch, or check a deadline. Please note that I communicate in English. Pick a field below, or just type your question.",
  inputPlaceholder: "What would you like to know?",
  resultsFor: (term: string) => `Here's what I found for "${term}":`,
  noMatch: (term: string) => `I couldn't find a conference matching "${term}". Please note I respond in English. Try a different topic or pick a category below.`,
  viewRegister: 'View & Register',
  visitWebsite: 'Visit Website',
  seeAllCount: (category: string, count: number) => `There ${count === 1 ? 'is' : 'are'} ${count} conference${count === 1 ? '' : 's'} in ${category}. See them all:`,
  seeAllBtn: (category: string) => `See all ${category} conferences`,
  noneInCategory: (category: string) => `I couldn't find any conferences in ${category} yet.`,
  registrationIntro: 'To register, first find the conference you want to attend - each conference page has its own registration button.',
  registrationForConf: (name: string) => `Ready to register for "${name}"?`,
  registerNowBtn: 'Register Now',
  browseBtn: 'Browse all conferences',
  generalContact: "You can reach the Mind-IL team at mindil102026@gmail.com.",
  contactForConf: (name: string, email: string) => `For "${name}", you can reach the organizers at ${email}.`,
  deadlineNotFound: "I couldn't tell which conference you meant - could you mention its name?",
  deadlineIntro: (name: string) => `Here are the key dates for "${name}":`,
  registrationDeadlineLabel: 'Registration deadline',
  abstractDeadlineLabel: 'Abstract submission deadline',
  noDeadlineInfo: (name: string) => `I don't have deadline information for "${name}" yet.`,
  organizerNotFound: "I couldn't tell which conference you meant - could you mention its name?",
  organizerAnswer: (confName: string, organizer: string) => `"${confName}" is organized by ${organizer}.`,
  organizerNoInfo: (confName: string) => `I don't have organizer details for "${confName}" yet, but you can find contact info on the conference page.`,
  abstractEditGeneral: "To edit an abstract you've already submitted, please reach out directly to the organizers of that specific conference - their contact details are on the conference page.",
  abstractEditWithContact: (confName: string, email: string) => `To edit your abstract for "${confName}", please contact the organizers directly at ${email}.`,
  askField: "Sure, I can help you find it. What field or subject area is the conference in? (e.g. Physics, Psychology, Linguistics...)",
  askFaculty: "Got it. Which faculty or department would it be related to? For example: Humanities and Arts, Social Sciences & Law, BioMed, Engineering, or Exact Sciences.",
  stillNoMatchIntro: "I still couldn't find an exact match, but here's that category - take a look:",
  stillNoMatchFallback: "I couldn't quite match that to one of our categories. Here's the full list of conferences instead:",
  general: {
    about: "Mind-IL is Israel's first academic initiative of its kind: dozens of conferences across a wide range of scientific and research fields will take place simultaneously throughout the country.\n\nOn October 25-26, thousands of researchers and professionals from Israel and around the world will gather for two days of scientific meetings, collaborations, new research opportunities, and groundbreaking thinking.\n\nThe initiative, established together with the Young Israeli Academy, aims to leverage the arrival in Israel of thousands of Israeli researchers from around the world during October, in order to create new connections between researchers and institutions, encourage academic and interdisciplinary collaboration, and strengthen the international standing of Israeli academia.",
    goals: "The initiative's main goals:\n• Creating connections between fields, researchers, and research institutions\n• Advancing the international standing of Israeli academia\n• Building a lasting tradition for the Israeli academic community, in Israel and abroad",
    disclaimers: "A few important clarifications about Mind-IL:\n• The initiative is non-political\n• It does not fund travel for Israelis to come to Israel\n• It is not affiliated with initiatives such as Fly&Vote or the Aid Coalition\n• It does not offer assistance for Israelis to participate in elections",
    sponsors: "Current supporters include the Young Israeli Academy, the Fulbright Foundation, the Segal Foundation, and the Neaman Institute for National Policy Research. Produced in partnership with 'Kfaim'."
  }
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Humanities and Arts': ['humanities', 'arts', 'literature', 'history', 'philosophy', 'linguistics', 'languages'],
  'Social Sciences & Law': ['social', 'law', 'legal', 'political', 'psychology', 'sociology', 'economics', 'education'],
  'BioMed': ['biomed', 'medicine', 'medical', 'health', 'biology', 'clinical', 'genomics', 'neuroscience'],
  'Engineering': ['engineering', 'mechanical', 'electrical', 'civil', 'computer engineering', 'materials'],
  'Exact Sciences': ['exact', 'physics', 'chemistry', 'mathematics', 'math', 'computer science', 'statistics']
};

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
  showCategories = true; // שולט בהצגת הקטגוריות כהכוונה
  private allConferences: ConferenceLite[] = [];

  readonly t = TEXT;

  readonly categories = [
    'Humanities and Arts',
    'Social Sciences & Law',
    'BioMed',
    'Engineering',
    'Exact Sciences'
  ];

  private awaitingField = false;
  private awaitingFaculty = false;
  private pendingQueryText = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.hasUnread = true;
    this.messages = [{ from: 'bot', text: this.t.greeting }];

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
            websiteUrl: c.Links?.website || c.links?.website || '',
            registrationDeadline: c.RegistrationDeadline || c.registrationDeadline || '',
            abstractDeadline: c.AbstractDeadline || c.abstractDeadline || '',
            contactName: c.ContactName || c.contactName || '',
            contactEmail: c.ContactEmail || c.contactEmail || ''
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

  selectCategory(category: string): void {
    this.resetFindFlow();
    this.showCategories = false; // הסתרת הקטגוריות לאחר בחירה (אופציונלי)
    this.messages.push({ from: 'user', text: category });
    const count = this.allConferences.filter(c => c.categories.includes(category)).length;
    if (count === 0) {
      this.messages.push({ from: 'bot', text: this.t.noneInCategory(category) });
      return;
    }
    this.messages.push({
      from: 'bot',
      text: this.t.seeAllCount(category, count),
      categoryLink: category
    });
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;
    this.messages.push({ from: 'user', text });
    this.userInput = '';
    const lower = text.toLowerCase();

    if (this.awaitingField) {
      this.handleFieldAnswer(text);
      return;
    }
    if (this.awaitingFaculty) {
      this.handleFacultyAnswer(text);
      return;
    }

    if (/deadline/.test(lower)) {
      this.respondWithDeadline(text);
      return;
    }

    if (/who (organiz|runs|is behind)|organi[sz]ing|organi[sz]er/.test(lower)) {
      this.respondWithOrganizer(text);
      return;
    }

    if (/edit.*abstract|update.*abstract|change.*abstract|abstract.*(edit|update|change)/.test(lower)) {
      this.respondWithAbstractEditInfo(text);
      return;
    }

    if (this.respondWithGeneralInfo(lower)) {
      return;
    }

    if (/contact|email/.test(lower)) {
      this.respondWithContact(text);
      return;
    }

    if (/looking for a conference|find a conference|search for a conference|where (can|do) i find|which conference (is|covers)|is there a conference/.test(lower)) {
      this.handleFindConferenceIntent(text);
      return;
    }

    if (/regist/.test(lower)) {
      this.respondWithRegistrationInfo(text);
      return;
    }

    const matches = this.broadMatch(text);
    this.respondWithMatches(matches, text);
  }

  private handleFindConferenceIntent(text: string): void {
    const matches = this.broadMatch(text);
    if (matches.length > 0) {
      this.respondWithMatches(matches, text);
      return;
    }
    this.pendingQueryText = text;
    this.awaitingField = true;
    this.messages.push({ from: 'bot', text: this.t.askField });
  }

  private handleFieldAnswer(fieldAnswer: string): void {
    this.awaitingField = false;
    const combined = `${this.pendingQueryText} ${fieldAnswer}`;
    const matches = this.broadMatch(combined);
    if (matches.length > 0) {
      this.pendingQueryText = '';
      this.respondWithMatches(matches, fieldAnswer);
      return;
    }
    this.pendingQueryText = combined;
    this.awaitingFaculty = true;
    this.messages.push({ from: 'bot', text: this.t.askFaculty });
  }

  private handleFacultyAnswer(facultyAnswer: string): void {
    this.awaitingFaculty = false;
    const lower = facultyAnswer.toLowerCase();
    const matchedCategory = this.categories.find(cat => {
      if (lower.includes(cat.toLowerCase())) return true;
      return (CATEGORY_KEYWORDS[cat] || []).some(kw => lower.includes(kw));
    });

    const combined = `${this.pendingQueryText} ${facultyAnswer}`;
    this.pendingQueryText = '';

    if (!matchedCategory) {
      const matches = this.broadMatch(combined);
      if (matches.length > 0) {
        this.respondWithMatches(matches, facultyAnswer);
        return;
      }
      this.messages.push({ from: 'bot', text: this.t.stillNoMatchFallback, showBrowseButton: true });
      return;
    }

    const withinCategory = this.allConferences.filter(c => c.categories.includes(matchedCategory));
    const refined = this.broadMatch(combined, withinCategory);
    if (refined.length > 0) {
      this.respondWithMatches(refined, facultyAnswer);
      return;
    }
    if (withinCategory.length === 0) {
      this.messages.push({ from: 'bot', text: this.t.noneInCategory(matchedCategory) });
      return;
    }
    this.messages.push({
      from: 'bot',
      text: `${this.t.stillNoMatchIntro} ${this.t.seeAllCount(matchedCategory, withinCategory.length)}`,
      categoryLink: matchedCategory
    });
  }

  private resetFindFlow(): void {
    this.awaitingField = false;
    this.awaitingFaculty = false;
    this.pendingQueryText = '';
  }

  private broadMatch(text: string, pool: ConferenceLite[] = this.allConferences): ConferenceLite[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'for', 'conference', 'conferences', 'on', 'in', 'about',
      'im', 'want', 'to', 'find', 'looking', 'look', 'search', 'searching',
      'where', 'can', 'do', 'does', 'of', 'and', 'is', 'me', 'my', 'some',
      'something', 'not', 'sure', 'exactly', 'its', 'called', 'that', 'interested'
    ]);
    const tokens = text.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w));
    if (tokens.length === 0) return [];

    const scored = pool
      .map(c => {
        const haystack = `${c.name} ${c.description} ${c.categories.join(' ')}`;
        const score = tokens.filter(t => this.matchesWholeWord(haystack, t)).length;
        return { conf: c, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) return [];

    const maxScore = scored[0].score;
    const threshold = maxScore > 1 ? 2 : 1;
    return scored.filter(x => x.score >= threshold).map(x => x.conf);
  }

private findConferenceMentioned(text: string): ConferenceLite | undefined {
  const lower = text.toLowerCase();
  
  // חיפוש מדויק של שם הכנס בתוך הטקסט
  const exactCandidates = this.allConferences.filter(c => {
    const nameLower = c.name.toLowerCase();
    if (nameLower.trim().includes(' ')) return lower.includes(nameLower);
    return this.matchesWholeWord(text, c.name);
  });
  if (exactCandidates.length > 0) {
    return exactCandidates.sort((a, b) => b.name.length - a.name.length)[0];
  }

  // אם אין התאמה מדויקת לשם של כנס, אל תנחש סתם מתוך חפיפת מילים כללית בשאלות רגישות!
  // נחזיר undefined כדי שהפונקציה הקוראת תבין שלא צוין כנס ותבקש מהמשתמש את שמו.
  return undefined;
}

  private respondWithDeadline(text: string): void {
    const conf = this.findConferenceMentioned(text);
    if (!conf) {
      this.messages.push({ from: 'bot', text: this.t.deadlineNotFound });
      return;
    }
    const lines: string[] = [];
    if (conf.registrationDeadline) lines.push(`${this.t.registrationDeadlineLabel}: ${conf.registrationDeadline}`);
    if (conf.abstractDeadline) lines.push(`${this.t.abstractDeadlineLabel}: ${conf.abstractDeadline}`);
    if (lines.length === 0) {
      this.messages.push({ from: 'bot', text: this.t.noDeadlineInfo(conf.name) });
      return;
    }
    this.messages.push({
      from: 'bot',
      text: `${this.t.deadlineIntro(conf.name)}\n${lines.join('\n')}`,
      results: [conf]
    });
  }

private respondWithContact(text: string): void {
  const conf = this.findConferenceMentioned(text);
  // אם המשתמש שאל שאלה שדורשת כנס ספציפי אבל לא ציין שמו, אפשר לבקש ממנו להבהיר
  // לחלופין, אם הוא רצה סתם את המייל הכללי של המערכת זה בסדר, אבל אם ניסה לשאול על כנס מסוים:
  if (text.toLowerCase().includes('conference') && !conf) {
    this.messages.push({ from: 'bot', text: "I couldn't tell which conference you meant - could you mention its name?" });
    return;
  }
  
  if (conf && conf.contactEmail) {
    this.messages.push({ from: 'bot', text: this.t.contactForConf(conf.name, conf.contactEmail) });
  } else {
    this.messages.push({ from: 'bot', text: this.t.generalContact });
  }
}

  private respondWithOrganizer(text: string): void {
    const conf = this.findConferenceMentioned(text);
    if (!conf) {
      this.messages.push({ from: 'bot', text: this.t.organizerNotFound });
      return;
    }
    if (conf.contactName) {
      this.messages.push({ from: 'bot', text: this.t.organizerAnswer(conf.name, conf.contactName), results: [conf] });
    } else if (conf.contactEmail) {
      this.messages.push({ from: 'bot', text: this.t.contactForConf(conf.name, conf.contactEmail), results: [conf] });
    } else {
      this.messages.push({ from: 'bot', text: this.t.organizerNoInfo(conf.name) });
    }
  }

  private respondWithAbstractEditInfo(text: string): void {
    const conf = this.findConferenceMentioned(text);
    if (!conf) {
      this.messages.push({ from: 'bot', text: "I couldn't tell which conference you meant - could you mention its name?" });
      return;
    }
    if (conf.contactEmail) {
      this.messages.push({ from: 'bot', text: this.t.abstractEditWithContact(conf.name, conf.contactEmail) });
    } else {
      this.messages.push({ from: 'bot', text: this.t.abstractEditGeneral });
    }
  }

  private respondWithGeneralInfo(lower: string): boolean {
    const g = this.t.general;

    if (/political|politics|\bvote\b|voting|election|fly\s*&?\s*vote|aid coalition/.test(lower)) {
      this.messages.push({ from: 'bot', text: g.disclaimers });
      return true;
    }
    if (/sponsor|support(er|ing)/.test(lower)) {
      this.messages.push({ from: 'bot', text: g.sponsors });
      return true;
    }
    if (/\bgoal|purpose/.test(lower)) {
      this.messages.push({ from: 'bot', text: g.goals });
      return true;
    }
    if (/what is mind-?il|about mind-?il|when is the conference|how many conferences/.test(lower)) {
      this.messages.push({ from: 'bot', text: g.about });
      return true;
    }
    return false;
  }

  private respondWithRegistrationInfo(text: string): void {
    const conf = this.findConferenceMentioned(text);
    if (conf) {
      this.messages.push({
        from: 'bot',
        text: this.t.registrationForConf(conf.name),
        registerLink: conf.id
      });
      return;
    }
    this.messages.push({
      from: 'bot',
      text: this.t.registrationIntro,
      showBrowseButton: true
    });
  }

  private matchesWholeWord(haystack: string, term: string): boolean {
    const escaped = term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!escaped) return false;
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(haystack);
  }

  private respondWithMatches(matches: ConferenceLite[], term: string): void {
    if (matches.length === 0) {
      this.messages.push({ from: 'bot', text: this.t.noMatch(term) });
      return;
    }
    this.messages.push({
      from: 'bot',
      text: this.t.resultsFor(term),
      results: matches.slice(0, 5)
    });
  }
}