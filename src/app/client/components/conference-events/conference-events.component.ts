// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-conference-events',
//   templateUrl: './conference-events.component.html',
//   styleUrls: ['./conference-events.component.css']
// })
// export class ConferenceEventsComponent implements OnInit {
//   pageSize = 12;
//   currentPage = 1;

//   constructor() { }
//   ngOnInit(): void { }

//   conferences: any[] = [
//     {
//       name: 'Behavioral Change 2026',
//       discipline: 'decision making, organizational behavior, behavioral economics, consumer behavior, marketing',
//       organizers: [
//         { name: 'Kinneret Teodorescu', affiliation: 'Technion' },
//         { name: 'Ayala Arad', affiliation: 'TAU' },
//         { name: 'Yoella Bereby-Meyer', affiliation: 'BGU' },
//         { name: 'Ruthi Mayo', affiliation: 'HUJ' },
//         { name: 'Shachar Ayal', affiliation: 'Reichman' },
//         { name: 'Eliran Halali', affiliation: 'BIU' },
//         { name: 'Arik Chashin', affiliation: 'UHaifa' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeb0OqxjZ_P0xpf5hkoU6LVItJb5EdrrSLKuPlMWazDQ_a-VQ/viewform?usp=sharing&ouid=110040439303436821906',
//       comments: 'Tentative location: Coller School of Management, Tel Aviv University. Participants may also be interested in related conferences in Economics and Psychology.'
//     },
//     {
//       name: 'Ecology and conservation biology 2026',
//       discipline: 'no name yet',
//       organizers: [
//         { name: 'Amir Ayali', affiliation: 'TAU' },
//         { name: 'Uri Roll', affiliation: 'BGU' },
//         { name: 'Marcello Sternberg', affiliation: 'TAU' },
//         { name: 'Assaf Shwartz', affiliation: 'TECH' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeCS2rs9yyYZKjOx4yutC67MfVAlBasQf21-ImaMmBq2277xg/viewform',
//       comments: ''
//     },
//     {
//       name: 'Data Science, Operation Research and Analytics',
//       discipline: '',
//       organizers: [
//         { name: 'Irad Ben Gal', affiliation: 'TAU' },
//         { name: 'Tal Raviv', affiliation: 'TAU' },
//         { name: 'Ran Snitkovsky', affiliation: 'TAU' },
//         { name: 'Moran Koren', affiliation: 'BGU' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/1xWvdD4qbVTXUV6S6ceIWld98t34B82dYZHNCURgzz2s/edit?ts=69edc542',
//       comments: ''
//     },
//     {
//       name: 'Economics and Finance',
//       discipline: '',
//       organizers: [
//         { name: 'Roee Levy', affiliation: 'TAU' },
//         { name: 'Ro\'ee Zultan', affiliation: 'BGU' },
//         { name: 'Ariell Resheff', affiliation: 'PSE' },
//         { name: 'Yossi Spiegel', affiliation: 'TAU' },
//         { name: 'Yishay Yafe', affiliation: 'HU' }
//       ],
//       surveyLink: 'https://forms.gle/5ZY4BonAMMwt4ZzH8',
//       comments: 'Bergals School of Economics, Tel Aviv University'
//     },
//     {
//       name: 'Childhood from a Multidisciplinary Perspective: Challenges and Opportunities',
//       discipline: '',
//       organizers: [
//         { name: 'Ronny Geva', affiliation: 'BIU' },
//         { name: 'Reut Arbel', affiliation: 'HAI' },
//         { name: 'Daphna Dollberg Ginio', affiliation: 'The Academic College of Tel Aviv–Yaffo' },
//         { name: 'Zipi Horowitz-Kraus', affiliation: 'TECH' },
//         { name: 'Efrat Sher-Censor', affiliation: 'HAI' },
//         { name: 'Shir Atzil', affiliation: 'HUJI' },
//         { name: 'Naama Atzaba-Poria', affiliation: 'BGU' },
//         { name: 'Tahli Frenkel', affiliation: 'Reichman' },
//         { name: 'Anat Prior', affiliation: 'HAI' }
//       ],
//       surveyLinks: [
//         { label: 'Hebrew', url: 'https://forms.gle/ZTgCEi12AKvhvgEJA' },
//         { label: 'English', url: 'https://forms.gle/6pQ2ndRhw42TnSrz8' }
//       ],
//       comments: 'In English'
//     },
//     {
//       name: 'Philosophy and Jewish Philosophy',
//       discipline: '',
//       organizers: [
//         { name: 'Yehuda Halper', affiliation: 'BIU' },
//         { name: 'Pini Ifergan', affiliation: 'BIU' }
//       ],
//       surveyLink: '',
//       comments: ''
//     },
//     {
//       name: 'BioMed',
//       discipline: '',
//       organizers: [],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdSIk63otoVlSmBPntVK6iw6FbRMPbSOjIx8OqNJjh9-icV4w/viewform',
//       comments: 'Please do not publish till we finalize the BioMed Google doc (Adi Stern)'
//     },
//     {
//       name: 'Cancer biology across scales',
//       discipline: '',
//       organizers: [
//         { name: 'Leeat Keren', affiliation: 'WIS' },
//         { name: 'Uri Ben-David', affiliation: 'TAU' },
//         { name: 'Ruth Schertz-Shouval', affiliation: 'WIS' }
//       ],
//       surveyLink: '',
//       comments: 'Location: Weizmann Institute of Science'
//     },
//     {
//       name: 'Translational Medicine',
//       discipline: '',
//       organizers: [
//         { name: 'Karen Avraham', affiliation: 'TAU' },
//         { name: 'Ido Wolf', affiliation: 'TASMC/TAU' },
//         { name: 'Carmit Levy', affiliation: 'TAU' },
//         { name: 'Ran Kornowski', affiliation: 'Rabin Medical Center/TAU' },
//         { name: 'Asaf Madi', affiliation: 'TAU' },
//         { name: 'Yaara Oren', affiliation: 'TAU' },
//         { name: 'Elhanan Borenstein', affiliation: 'TAU' },
//         { name: 'Michal Kovo', affiliation: 'Shamir/TAU' }
//       ],
//       surveyLink: '',
//       comments: 'Museum of Natural History, TAU'
//     },
//     {
//       name: 'Developmental biology, stem cells, and regeneration',
//       discipline: '',
//       organizers: [
//         { name: 'Eran Meshorer', affiliation: 'HUJI' },
//         { name: 'Ruth Ashery-Padan', affiliation: 'TAU' },
//         { name: 'Chen Luxenburg', affiliation: 'TAU' },
//         { name: 'Avraham Yaron', affiliation: 'WIS' }
//       ],
//       surveyLink: '',
//       comments: 'Probably TAU'
//     },
//     {
//       name: 'Genomics, Computational & Structural Biology',
//       discipline: '',
//       organizers: [
//         { name: 'Adi Stern', affiliation: 'TAU' },
//         { name: 'Igor Ulitsky', affiliation: 'WIS' }
//       ],
//       surveyLink: '',
//       comments: 'Location: Weizmann Institute of Science'
//     },
//     {
//       name: 'Immunology, Microbiology & Infection Biology',
//       discipline: '',
//       organizers: [
//         { name: 'Idan Frumkin', affiliation: 'TAU' },
//         { name: 'Ruth Hershberg', affiliation: 'Technion' }
//       ],
//       surveyLink: '',
//       comments: 'Location: Weizmann Institute of Science'
//     },
//     {
//       name: 'Microbiome',
//       discipline: '',
//       organizers: [
//         { name: 'Omry Koren', affiliation: 'BIU' },
//         { name: 'Moran Yassour', affiliation: 'HUJI' },
//         { name: 'Naama Geva Zatorsky', affiliation: 'Technion' }
//       ],
//       surveyLink: '',
//       comments: 'At the Faculty of Medicine, Safed'
//     },
//     {
//       name: 'Brain and Mind',
//       discipline: '',
//       organizers: [
//         { name: 'Haana Keren', affiliation: 'BIU' },
//         { name: 'Evan Elliott', affiliation: 'BIU' },
//         { name: 'Meital Gal Tanamy', affiliation: 'BIU' }
//       ],
//       surveyLink: '',
//       comments: 'At the Faculty of Medicine, Safed'
//     },
//     {
//       name: 'Neuroscience',
//       discipline: '',
//       organizers: [
//         { name: 'Naama Friedmann', affiliation: 'TAU' },
//         { name: 'Michal Ben Shachar', affiliation: 'BIU' },
//         { name: 'Asya Rolls', affiliation: 'TAU' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdARqKR-KMhMDnD39yLI1537vtjQKLC1G3aaQ45vydg5h8ntA/viewform',
//       comments: 'TBD'
//     },
//     {
//       name: 'Imagining Machines? Art, Architecture and Performance in the Age of Artificial Intelligence',
//       discipline: '',
//       organizers: [
//         { name: 'Efrat Lieberthal', affiliation: 'TAU' },
//         { name: 'Renana Bartal', affiliation: 'TAU' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeX3Ks86aT8t08yJZLTyN1EPMvqKwIEhcFcJ3xYS2UF19o2BQ/viewform?usp=dialog',
//       comments: ''
//     },
//     {
//       name: 'Cities and Complexity in Israel: Towards the Second Quarter of the 21st Century',
//       discipline: '',
//       organizers: [
//         { name: 'Vered Blass', affiliation: 'TAU' },
//         { name: 'Efrat Lieberthal', affiliation: 'TAU' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSe3ECVXcJpwg-9aa_AnbR3RJjjQPIGKLF6jSb0ag-WnxY6O3Q/viewform?usp=dialog',
//       comments: 'Held within the framework of the Archimedes Center'
//     },
//     {
//       name: 'Physics',
//       discipline: '',
//       organizers: [
//         { name: 'Erez Etzion', affiliation: 'TAU' },
//         { name: 'Roy Beck-Barkai', affiliation: 'TAU' },
//         { name: 'Tomer Volansky', affiliation: 'TAU' },
//         { name: 'Ranny Budnik', affiliation: 'WIS' },
//         { name: 'Adi Ashkenazi', affiliation: 'TAU' },
//         { name: 'Yevgeny Kats', affiliation: 'BGU' },
//         { name: 'Alon Ron', affiliation: 'TAU' },
//         { name: 'Ran Finkelstein', affiliation: 'TAU' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/1NuwqkbwqMyJMbtpezkrKUHfyezHIQ0eLEKaepGpvHWQ/edit',
//       comments: 'Probably at TAU. Website: https://physics-in-israel-2026.netlify.app/'
//     },
//     {
//       name: 'Chemistry',
//       discipline: '',
//       organizers: [
//         { name: 'Gonen Ashkenazy', affiliation: 'BGU' },
//         { name: 'Amichay Vardi', affiliation: 'BGU' },
//         { name: 'Gil Markowitz', affiliation: 'TAU' },
//         { name: 'Michael Meijler', affiliation: 'BGU' },
//         { name: 'Omer Yaffe', affiliation: 'WIS' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeKxXwgMAuAmVdRP4BuPvIv_duq9zyQZbIq4n5WeWGhoHUHcw/viewform',
//       comments: 'Possibly in BGU (Reserved seminar hall)'
//     },
//     {
//       name: 'Political Science',
//       discipline: '',
//       organizers: [
//         { name: 'Yotam Margalit', affiliation: 'TAU' },
//         { name: 'Noam Gidron', affiliation: 'HUJI' }
//       ],
//       surveyLink: '',
//       comments: 'Probably at TAU'
//     },
//     {
//       name: 'Communication',
//       discipline: '',
//       organizers: [
//         { name: 'Neta Kligler-Vilenchik', affiliation: 'HUJI' },
//         { name: 'Keren Tenenboim-Weinblatt', affiliation: 'HUJI' }
//       ],
//       surveyLink: '',
//       comments: 'Hebrew University'
//     },
//     {
//       name: 'Psychology',
//       discipline: '',
//       organizers: [
//         { name: 'Halely Balaban', affiliation: 'Open University' },
//         { name: 'Nurit Gronau', affiliation: 'Open University' },
//         { name: 'Matan Mazor', affiliation: 'University of Oxford' },
//         { name: 'Liad Mudrik', affiliation: 'Tel Aviv University' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLScjIC0k32UqQ44bxIFFQUECXrWmcAt2-ygTKD46MFPoZV6VvA/viewform?usp=header',
//       comments: 'The Open University'
//     },
//     {
//       name: 'Sociology and Anthropology',
//       discipline: '',
//       organizers: [
//         { name: 'Yuval Feinstein', affiliation: 'University of Haifa' },
//         { name: 'Orna Sasson-Levy', affiliation: 'Bar-Ilan University' },
//         { name: 'Alexandra Kalev', affiliation: 'Tel-Aviv University' },
//         { name: 'Liron Shani', affiliation: 'Hebrew University' },
//         { name: 'Rafi Grosgllik', affiliation: 'Ben-Gurion University' },
//         { name: 'Dan Kotliar', affiliation: 'University of Haifa' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/u/1/d/1KD1WUEqcq48UUXDfC8iFuGWkudhP9BVqLiLJ9h0KCNg/edit?usp=sharing_eil_se_dm&ts=69fc848f',
//       comments: 'University of Haifa'
//     },
//     {
//       name: 'Strategy, Innovation and Entrepreneurship',
//       discipline: '',
//       organizers: [
//         { name: 'Niron Hashai', affiliation: 'Reichman U' },
//         { name: 'Moran Lazar', affiliation: 'TAU' },
//         { name: 'Gil Avnimelech', affiliation: 'Ono' }
//       ],
//       surveyLink: 'https://forms.gle/GCmeYFTDJdT4vTAz7',
//       comments: 'Location either at Reichman U or TBD'
//     },
//     {
//       name: 'History',
//       discipline: '',
//       organizers: [
//         { name: 'Naama Cohen Hanegbi', affiliation: 'TAU' },
//         { name: 'Amir Teicher', affiliation: 'TAU' },
//         { name: 'Moshe Blidstein', affiliation: 'Haifa University' },
//         { name: 'Oded Y. Steinberg', affiliation: 'HUJI' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/1YDw0Rt8-NUQKi4m6B4Aba9dSLW_xThLV6DN7HNHShNQ/edit?ts=69f31f36#responses',
//       comments: 'TAU'
//     },
//     {
//       name: 'Future of Scheduling: Integrating OR, AI, and Data for Smart Resource Allocation',
//       discipline: '',
//       organizers: [
//         { name: 'Izack Cohen', affiliation: 'BIU' }
//       ],
//       surveyLink: '',
//       comments: 'BIU'
//     },
//     {
//       name: 'History & Philosophy of Science & Ideas',
//       discipline: '',
//       organizers: [
//         { name: 'ד"ר אורלי דהאן', affiliation: '' },
//         { name: 'ד"ר יעל קדר', affiliation: '' },
//         { name: 'פרופ\' שאול קציר', affiliation: '' },
//         { name: 'פרופ\' יוסי שורץ', affiliation: '' },
//         { name: 'פרופ\' אורלי שנקר', affiliation: '' }
//       ],
//       surveyLink: 'https://forms.gle/6qUs7PhfeQhSvEj29',
//       comments: 'TAU'
//     },
//     {
//       name: 'Computer Science',
//       discipline: '',
//       organizers: [
//         { name: 'Inbal Talgam-Cohen', affiliation: 'TAU' },
//         { name: 'Eyal Ronen', affiliation: 'TAU' },
//         { name: 'Talya Eden', affiliation: 'BIU' },
//         { name: 'Ohad Shamir', affiliation: 'Weizmann' },
//         { name: 'Yuval Emek', affiliation: 'Technion' },
//         { name: 'Roi Reichart', affiliation: 'Technion' },
//         { name: 'Shachar Itzhaky', affiliation: 'Technion' },
//         { name: 'Adi Akavia', affiliation: 'Haifa University' }
//       ],
//       surveyLink: '',
//       comments: 'TAU'
//     },
//     {
//       name: 'Electrical Engineering',
//       discipline: '',
//       organizers: [
//         { name: 'Eytan Yaakobi', affiliation: 'Technion' }
//       ],
//       surveyLink: '',
//       comments: ''
//     },
//     {
//       name: 'Chemical Engineering and Computational Chemistry',
//       discipline: '',
//       organizers: [
//         { name: 'Dr. Alon Grinberg Dana', affiliation: 'Technion' }
//       ],
//       surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSf92KDn31Ol_AmIDtWFvYOzvMnqoY5V1sr4Q1tRv3Q1r9BhrQ/viewform?usp=sharing&ouid=117135993168673153319',
//       comments: 'Location: Technion, Haifa'
//     },
//     {
//       name: 'Law — כנס "חידושים במשפט"',
//       discipline: '',
//       organizers: [
//         { name: 'Ronen Avraham', affiliation: 'TAU' },
//         { name: 'Ofra Bloch', affiliation: 'TAU' },
//         { name: 'Kobi Kastiel', affiliation: 'TAU' },
//         { name: 'Yifat Naftali Ben Zion', affiliation: 'TAU' },
//         { name: 'Issi Rosen-Zvi', affiliation: 'TAU' }
//       ],
//       surveyLink: '',
//       comments: 'TAU, Faculty of Law'
//     },
//     {
//       name: 'Gender and Family Studies',
//       discipline: '',
//       organizers: [
//         { name: 'Prof. Anat Herbst-Debby', affiliation: '' },
//         { name: 'Prof. Amit Kaplan', affiliation: '' },
//         { name: 'Prof. Miri Rozmarin', affiliation: '' }
//       ],
//       surveyLink: 'https://docs.google.com/document/d/169KEe1tBpdGD2EKieTB0Or7isSE8ouE9/edit?usp=drive_link&ouid=107952032953250371815&rtpof=true&sd=true',
//       comments: 'Tel-Aviv Yafo Academic College or Bar-Ilan University. Additional organizers may be added.'
//     }
//   ];

//   get totalPages(): number {
//     return Math.ceil(this.conferences.length / this.pageSize);
//   }

//   get pages(): number[] {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   get pagedConferences(): any[] {
//     const start = (this.currentPage - 1) * this.pageSize;
//     return this.conferences.slice(start, start + this.pageSize);
//   }

//   goToPage(page: number): void {
//     if (page < 1 || page > this.totalPages) return;
//     this.currentPage = page;
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }
//   get lastUpdated(): Date {
//     return this.conferences
//       .filter(c => c.addedAt)
//       .map(c => new Date(c.addedAt))
//       .reduce((max, d) => d > max ? d : max, new Date(0));
//   }

// }

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conference-events',
  templateUrl: './conference-events.component.html',
  styleUrls: ['./conference-events.component.css']
})
export class ConferenceEventsComponent implements OnInit {
  pageSize = 12;
  currentPage = 1;

  constructor() { }
  ngOnInit(): void { }

  conferences: any[] = [
    {
      name: 'Behavioral Change 2026',
      addedAt: '2026-05-26',
      discipline: 'decision making, organizational behavior, behavioral economics, consumer behavior, marketing',
      organizers: [
        { name: 'Kinneret Teodorescu', affiliation: 'Technion' },
        { name: 'Ayala Arad', affiliation: 'TAU' },
        { name: 'Yoella Bereby-Meyer', affiliation: 'BGU' },
        { name: 'Ruthi Mayo', affiliation: 'HUJ' },
        { name: 'Shachar Ayal', affiliation: 'Reichman' },
        { name: 'Eliran Halali', affiliation: 'BIU' },
        { name: 'Arik Chashin', affiliation: 'UHaifa' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeb0OqxjZ_P0xpf5hkoU6LVItJb5EdrrSLKuPlMWazDQ_a-VQ/viewform?usp=sharing&ouid=110040439303436821906',
      comments: 'Tentative location: Coller School of Management, Tel Aviv University.'
    },
    {
      name: 'Ecology and conservation biology 2026',
      addedAt: '2026-05-26',
      discipline: 'no name yet',
      organizers: [
        { name: 'Amir Ayali', affiliation: 'TAU' },
        { name: 'Uri Roll', affiliation: 'BGU' },
        { name: 'Marcello Sternberg', affiliation: 'TAU' },
        { name: 'Assaf Shwartz', affiliation: 'TECH' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeCS2rs9yyYZKjOx4yutC67MfVAlBasQf21-ImaMmBq2277xg/viewform',
      comments: ''
    },
    {
      name: 'Data Science, Operation Research and Analytics',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Irad Ben Gal', affiliation: 'TAU' },
        { name: 'Tal Raviv', affiliation: 'TAU' },
        { name: 'Ran Snitkovsky', affiliation: 'TAU' },
        { name: 'Moran Koren', affiliation: 'BGU' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/1xWvdD4qbVTXUV6S6ceIWld98t34B82dYZHNCURgzz2s/edit?ts=69edc542',
      comments: ''
    },
    {
      name: 'Economics and Finance',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Roee Levy', affiliation: 'TAU' },
        { name: 'Ro\'ee Zultan', affiliation: 'BGU' },
        { name: 'Ariell Resheff', affiliation: 'PSE' },
        { name: 'Yossi Spiegel', affiliation: 'TAU' },
        { name: 'Yishay Yafe', affiliation: 'HU' }
      ],
      surveyLink: 'https://forms.gle/5ZY4BonAMMwt4ZzH8',
      comments: 'Bergals School of Economics, Tel Aviv University'
    },
    {
      name: 'Childhood from a Multidisciplinary Perspective: Challenges and Opportunities',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Ronny Geva', affiliation: 'BIU' },
        { name: 'Reut Arbel', affiliation: 'HAI' },
        { name: 'Daphna Dollberg Ginio', affiliation: 'The Academic College of Tel Aviv–Yaffo' },
        { name: 'Zipi Horowitz-Kraus', affiliation: 'TECH' },
        { name: 'Efrat Sher-Censor', affiliation: 'HAI' },
        { name: 'Shir Atzil', affiliation: 'HUJI' },
        { name: 'Naama Atzaba-Poria', affiliation: 'BGU' },
        { name: 'Tahli Frenkel', affiliation: 'Reichman' },
        { name: 'Anat Prior', affiliation: 'HAI' }
      ],
      surveyLinks: [
        { label: 'Hebrew', url: 'https://forms.gle/ZTgCEi12AKvhvgEJA' },
        { label: 'English', url: 'https://forms.gle/6pQ2ndRhw42TnSrz8' }
      ],
      comments: 'In English'
    },
    {
      name: 'Philosophy and Jewish Philosophy',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Yehuda Halper', affiliation: 'BIU' },
        { name: 'Pini Ifergan', affiliation: 'BIU' }
      ],
      surveyLink: '',
      comments: ''
    },
    {
      name: 'BioMed',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdSIk63otoVlSmBPntVK6iw6FbRMPbSOjIx8OqNJjh9-icV4w/viewform',
      comments: ''
    },
    {
      name: 'Cancer biology across scales',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Leeat Keren', affiliation: 'WIS' },
        { name: 'Uri Ben-David', affiliation: 'TAU' },
        { name: 'Ruth Schertz-Shouval', affiliation: 'WIS' }
      ],
      surveyLink: '',
      comments: 'Location: Weizmann Institute of Science'
    },
    {
      name: 'Translational Medicine',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Karen Avraham', affiliation: 'TAU' },
        { name: 'Ido Wolf', affiliation: 'TASMC/TAU' },
        { name: 'Carmit Levy', affiliation: 'TAU' },
        { name: 'Ran Kornowski', affiliation: 'Rabin Medical Center/TAU' },
        { name: 'Asaf Madi', affiliation: 'TAU' },
        { name: 'Yaara Oren', affiliation: 'TAU' },
        { name: 'Elhanan Borenstein', affiliation: 'TAU' },
        { name: 'Michal Kovo', affiliation: 'Shamir/TAU' }
      ],
      surveyLink: '',
      comments: 'Museum of Natural History, TAU'
    },
    {
      name: 'Developmental biology, stem cells, and regeneration',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Eran Meshorer', affiliation: 'HUJI' },
        { name: 'Ruth Ashery-Padan', affiliation: 'TAU' },
        { name: 'Chen Luxenburg', affiliation: 'TAU' },
        { name: 'Avraham Yaron', affiliation: 'WIS' }
      ],
      surveyLink: '',
      comments: 'Probably TAU'
    },
    {
      name: 'Genomics, Computational & Structural Biology',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Adi Stern', affiliation: 'TAU' },
        { name: 'Igor Ulitsky', affiliation: 'WIS' }
      ],
      surveyLink: '',
      comments: 'Location: Weizmann Institute of Science'
    },
    {
      name: 'Immunology, Microbiology & Infection Biology',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Idan Frumkin', affiliation: 'TAU' },
        { name: 'Ruth Hershberg', affiliation: 'Technion' }
      ],
      surveyLink: '',
      comments: 'Location: Weizmann Institute of Science'
    },
    {
      name: 'Microbiome',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Omry Koren', affiliation: 'BIU' },
        { name: 'Moran Yassour', affiliation: 'HUJI' },
        { name: 'Naama Geva Zatorsky', affiliation: 'Technion' }
      ],
      surveyLink: '',
      comments: 'At the Faculty of Medicine, Safed'
    },
    {
      name: 'Brain and Mind',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Haana Keren', affiliation: 'BIU' },
        { name: 'Evan Elliott', affiliation: 'BIU' },
        { name: 'Meital Gal Tanamy', affiliation: 'BIU' }
      ],
      surveyLink: '',
      comments: 'At the Faculty of Medicine, Safed'
    },
    {
      name: 'Neuroscience',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Naama Friedmann', affiliation: 'TAU' },
        { name: 'Michal Ben Shachar', affiliation: 'BIU' },
        { name: 'Asya Rolls', affiliation: 'TAU' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdARqKR-KMhMDnD39yLI1537vtjQKLC1G3aaQ45vydg5h8ntA/viewform',
      comments: 'TBD'
    },
    {
      name: 'Imagining Machines? Art, Architecture and Performance in the Age of Artificial Intelligence',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Efrat Lieberthal', affiliation: 'TAU' },
        { name: 'Renana Bartal', affiliation: 'TAU' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeX3Ks86aT8t08yJZLTyN1EPMvqKwIEhcFcJ3xYS2UF19o2BQ/viewform?usp=dialog',
      comments: ''
    },
    {
      name: 'Cities and Complexity in Israel: Towards the Second Quarter of the 21st Century',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Vered Blass', affiliation: 'TAU' },
        { name: 'Efrat Lieberthal', affiliation: 'TAU' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSe3ECVXcJpwg-9aa_AnbR3RJjjQPIGKLF6jSb0ag-WnxY6O3Q/viewform?usp=dialog',
      comments: 'Held within the framework of the Archimedes Center'
    },
    {
      name: 'Physics',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Erez Etzion', affiliation: 'TAU' },
        { name: 'Roy Beck-Barkai', affiliation: 'TAU' },
        { name: 'Tomer Volansky', affiliation: 'TAU' },
        { name: 'Ranny Budnik', affiliation: 'WIS' },
        { name: 'Adi Ashkenazi', affiliation: 'TAU' },
        { name: 'Yevgeny Kats', affiliation: 'BGU' },
        { name: 'Alon Ron', affiliation: 'TAU' },
        { name: 'Ran Finkelstein', affiliation: 'TAU' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/1NuwqkbwqMyJMbtpezkrKUHfyezHIQ0eLEKaepGpvHWQ/edit',
      comments: 'Probably at TAU.'
    },
    {
      name: 'Chemistry',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Gonen Ashkenazy', affiliation: 'BGU' },
        { name: 'Amichay Vardi', affiliation: 'BGU' },
        { name: 'Gil Markowitz', affiliation: 'TAU' },
        { name: 'Michael Meijler', affiliation: 'BGU' },
        { name: 'Omer Yaffe', affiliation: 'WIS' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeKxXwgMAuAmVdRP4BuPvIv_duq9zyQZbIq4n5WeWGhoHUHcw/viewform',
      comments: 'Possibly in BGU (Reserved seminar hall)'
    },
    {
      name: 'Political Science',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Yotam Margalit', affiliation: 'TAU' },
        { name: 'Noam Gidron', affiliation: 'HUJI' }
      ],
      surveyLink: '',
      comments: 'Probably at TAU'
    },
    {
      name: 'Communication',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Neta Kligler-Vilenchik', affiliation: 'HUJI' },
        { name: 'Keren Tenenboim-Weinblatt', affiliation: 'HUJI' }
      ],
      surveyLink: '',
      comments: 'Hebrew University'
    },
    {
      name: 'Psychology',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Halely Balaban', affiliation: 'Open University' },
        { name: 'Nurit Gronau', affiliation: 'Open University' },
        { name: 'Matan Mazor', affiliation: 'University of Oxford' },
        { name: 'Liad Mudrik', affiliation: 'Tel Aviv University' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLScjIC0k32UqQ44bxIFFQUECXrWmcAt2-ygTKD46MFPoZV6VvA/viewform?usp=header',
      comments: 'The Open University'
    },
    {
      name: 'Sociology and Anthropology',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Yuval Feinstein', affiliation: 'University of Haifa' },
        { name: 'Orna Sasson-Levy', affiliation: 'Bar-Ilan University' },
        { name: 'Alexandra Kalev', affiliation: 'Tel-Aviv University' },
        { name: 'Liron Shani', affiliation: 'Hebrew University' },
        { name: 'Rafi Grosgllik', affiliation: 'Ben-Gurion University' },
        { name: 'Dan Kotliar', affiliation: 'University of Haifa' }
      ],
      surveyLink: 'https://docs.google.com/forms/u/1/d/1KD1WUEqcq48UUXDfC8iFuGWkudhP9BVqLiLJ9h0KCNg/edit?usp=sharing_eil_se_dm&ts=69fc848f',
      comments: 'University of Haifa'
    },
    {
      name: 'Strategy, Innovation and Entrepreneurship',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Niron Hashai', affiliation: 'Reichman U' },
        { name: 'Moran Lazar', affiliation: 'TAU' },
        { name: 'Gil Avnimelech', affiliation: 'Ono' }
      ],
      surveyLink: 'https://forms.gle/GCmeYFTDJdT4vTAz7',
      comments: 'Location either at Reichman U or TBD'
    },
    {
      name: 'History',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Naama Cohen Hanegbi', affiliation: 'TAU' },
        { name: 'Amir Teicher', affiliation: 'TAU' },
        { name: 'Moshe Blidstein', affiliation: 'Haifa University' },
        { name: 'Oded Y. Steinberg', affiliation: 'HUJI' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/1YDw0Rt8-NUQKi4m6B4Aba9dSLW_xThLV6DN7HNHShNQ/edit?ts=69f31f36#responses',
      comments: 'TAU'
    },
    {
      name: 'Future of Scheduling: Integrating OR, AI, and Data for Smart Resource Allocation',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Izack Cohen', affiliation: 'BIU' }
      ],
      surveyLink: '',
      comments: 'BIU'
    },
    {
      name: 'History & Philosophy of Science & Ideas',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'ד"ר אורלי דהאן', affiliation: '' },
        { name: 'ד"ר יעל קדר', affiliation: '' },
        { name: 'פרופ\' שאול קציר', affiliation: '' },
        { name: 'פרופ\' יוסי שורץ', affiliation: '' },
        { name: 'פרופ\' אורלי שנקר', affiliation: '' }
      ],
      surveyLink: 'https://forms.gle/6qUs7PhfeQhSvEj29',
      comments: 'TAU'
    },
    {
      name: 'Computer Science',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Inbal Talgam-Cohen', affiliation: 'TAU' },
        { name: 'Eyal Ronen', affiliation: 'TAU' },
        { name: 'Talya Eden', affiliation: 'BIU' },
        { name: 'Ohad Shamir', affiliation: 'Weizmann' },
        { name: 'Yuval Emek', affiliation: 'Technion' },
        { name: 'Roi Reichart', affiliation: 'Technion' },
        { name: 'Shachar Itzhaky', affiliation: 'Technion' },
        { name: 'Adi Akavia', affiliation: 'Haifa University' }
      ],
      surveyLink: '',
      comments: 'TAU'
    },
    {
      name: 'Electrical Engineering',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Eytan Yaakobi', affiliation: 'Technion' }
      ],
      surveyLink: '',
      comments: ''
    },
    {
      name: 'Chemical Engineering and Computational Chemistry',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Dr. Alon Grinberg Dana', affiliation: 'Technion' }
      ],
      surveyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSf92KDn31Ol_AmIDtWFvYOzvMnqoY5V1sr4Q1tRv3Q1r9BhrQ/viewform?usp=sharing&ouid=117135993168673153319',
      comments: 'Location: Technion, Haifa'
    },
    {
      name: 'Law — כנס "חידושים במשפט"',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Ronen Avraham', affiliation: 'TAU' },
        { name: 'Ofra Bloch', affiliation: 'TAU' },
        { name: 'Kobi Kastiel', affiliation: 'TAU' },
        { name: 'Yifat Naftali Ben Zion', affiliation: 'TAU' },
        { name: 'Issi Rosen-Zvi', affiliation: 'TAU' }
      ],
      surveyLink: '',
      comments: 'TAU, Faculty of Law'
    },
    {
      name: 'Gender and Family Studies',
      addedAt: '2026-05-26',
      discipline: '',
      organizers: [
        { name: 'Prof. Anat Herbst-Debby', affiliation: '' },
        { name: 'Prof. Amit Kaplan', affiliation: '' },
        { name: 'Prof. Miri Rozmarin', affiliation: '' }
      ],
      surveyLink: 'https://docs.google.com/document/d/169KEe1tBpdGD2EKieTB0Or7isSE8ouE9/edit?usp=drive_link&ouid=107952032953250371815&rtpof=true&sd=true',
      comments: 'Tel-Aviv Yafo Academic College or Bar-Ilan University.'
    }
  ];

  get totalPages(): number {
    return Math.ceil(this.conferences.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedConferences(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.conferences.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get lastUpdated(): Date {
    return this.conferences
      .filter(c => c.addedAt)
      .map(c => new Date(c.addedAt))
      .reduce((max, d) => d > max ? d : max, new Date(0));
  }
}