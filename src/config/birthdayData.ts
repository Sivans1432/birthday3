export interface PhotoItem {
  id: string
  src: string
  title: string
  subtitle: string
  date: string
  caption: string
  category?: string
  objectPosition?: string
}

export interface TimelineMilestone {
  id: string
  date: string
  title: string
  subtitle: string
  description: string
  iconName: 'heart' | 'sparkles' | 'calendar' | 'gift' | 'star'
  highlight?: boolean
  image?: string
  imageBadge?: string
  objectPosition?: string
}

export interface PromiseItem {
  id: number
  title: string
  description: string
}

export const BIRTHDAY_CONFIG = {
  // Birthday & Person details
  girlfriendName: "Mounika",
  nickname: "Ammuuu",
  shortNickname: "Ammu",
  specialNames: ["Ammuuu", "Bangaram", "Maa", "My Universe"],
  birthdayMonth: 9, // 0-indexed: 9 = October
  birthdayDay: 27,
  targetDateIso: "2026-10-27T00:00:00+05:30",
  // Target: October 27, 2026 at 12:00:00 AM IST (Asia/Kolkata)
  targetTimestampIST: new Date("2026-10-27T00:00:00+05:30").getTime(),

  // Audio track config
  audio: {
    title: "A Thousand Memories (Instrumental)",
    subtitle: "Dedicated to Ammuuu",
    src: "/assets/our-song.mp3",
  },

  // Main Birthday Letter (exact Telugu-English wording provided)
  letter: {
    salutation: "❤️🥹 Happy Birthday, Ammu 🎂💖",
    paragraphs: [
      "First of all, I am really sorry Ammu… 😔❤️ Nii birthday ki nee pakkana undi, nee face lo smile chusi, ninnu happy ga chesi, nee birthday ni neetho kalisi celebrate cheyyalani chala anukunna. Kaani unfortunately, ee roju nenu nee daggariki ralekapothunna. 🥺💔",
      "Ninnu chala miss chesthunnanu Ammuuu… 😢💖 Nee face lo smile chusi, nee voice ni vinipinchukoni, nee pakkana undi kalisi happy ga undali anukunna. Kaani distance tho nenu ninnu kalavaledu. 😔💔",
      "Ee roju nenu nee pakkana undakapoyina, ninnu happy ga chesi, nee birthday ni special ga cheyyalani chala anukunna Ammuuu. 😢💖 Kaani distance tho nenu ninnu kalavaledu. 😔💔",
      "Naa heart lo neeku kosam chala love undi Ammuuu… ❤️🥹 Nee smile, nee voice, nee presence, anni naaku chala precious Ammuuu. Naa life lo neeku kosam chala special place undi. 💖",
      "Ninnu birthday roju hug chesukoni, “Happy Birthday Maa” ani nee chevilo cheppalani, nee face lo aa happiness chudalani entho aashapaddanu. Kaani ee distance valla ippudu ivanni cheyyalekapothunna. Ninnu miss avuthunna feeling ni words lo cheppalenu. 😭❤️",
      "Nuvvu naaku entha special oo neeku telusa? Naa life lo nuvvu oka ordinary person kaadhu Maa.... Naa happiness lo oka part, naa thoughts lo oka part, naa heart ki chala close ayina person vi. ❤️🫂 Nuvvu happy ga unte naaku happiness, nuvvu sad ga unte naaku kuda baadha vesthundhi.",
      "Ee birthday roju nee pakkana lekapoyina, naa heart matram nee daggare undhi. 💖 Distance mana madhya undochu, kaani nuvvu naaku entha special oo maatram eppatiki maaradhu. Ninnu birthday roju personally wish cheyyalekapothunna ani naaku chala badha ga undhi. Please nannu ardham chesukuntav ani hope chesthunna, Ammu. 🥺❤️",
      "Nuvvu ee roju full happy ga undaali, chala navvaali, nee favourite things anni enjoy cheyyaali. Nee life lo nuvvu anukunna dreams anni nijam avvaali. Nee face lo smile eppudu alage undaali. God ninnu eppudu happy ga, healthy ga unchaali ani manaspoorthiga korukuntunna. 🙏🏻💗",
      "I am Sorry ,Maa, nii special day roju nee pakkana undalekapothunna. 😔❤️ Kaani okati gurthupettuko.... Ninnu wish cheyyadaniki nenu nee pakkana lekapoyinna,nee happiness kosam korukune manasutho ikkada unna.Ninnu miss avuthunna, nee birthday nii neetho celebrate cheyyalekapothunna ane feeling naaku eppatiki gurthundipothundhi. 🥹💞",
      "Oka roju ee distance antha dooram aipoyi, manam kalisi birthdays celebrate chesukune roju vasthundhani hope chesthunna. Appudu nee birthday ni inka beautiful ga celebrate chesukundham. ❤️🫶🏻",
      "Once again, Happiest Birthday to my Ammuuuu, my happiness, my Bangaram! 🎂🌹💋",
      "Nuvvu eppudu happy ga undaali, nee dreams anni fulfil avvaali, nee life antha love tho, happiness tho nindipovaali.",
      "I may not be beside you today, but you are always close to my heart. I miss you so much, Ammuuu ❤️🥹",
      "Love you so much! Happy Birthday, Maaaaaaaaaaaaaaaaaa 💖🫂🎂"

    ],
    signoff: "Forever Yours, With All My Heart ❤️"
  },

  // Personal Photo Gallery
  photos: [
    {
      id: "photo-1",
      src: "/assets/Snapchat-988247355.jpg",
      title: "My Favourite Smile ❤️",
      subtitle: "The smile that lights up my world",
      date: "Forever Favourite",
      caption: "A single glimpse of your smile erases every worry in my world. You are my purest joy, Ammuuu.",
      category: "Portraits"
    },
    {
      id: "photo-2",
      src: "/assets/us-together.jpg",
      title: "Us, Right Beside You ❤️",
      subtitle: "The warmth of your presence",
      date: "My Favourite Place",
      caption: "Sitting beside you, looking into your eyes, and sharing quiet moments together. You are my safe space and my entire happiness, Ammuuu.",
      category: "Together"
    },
    {
      id: "photo-3",
      src: "/assets/video-call-cute.jpg",
      title: "Late Night Calls & Sweet Moments 🥱💖",
      subtitle: "Even your sleepy yawns make me fall in love",
      date: "Midnight Talks",
      caption: "Countless video calls where distance disappears into laughs and sleepy smiles. No matter how far apart we are, seeing your face is the best part of every day.",
      category: "Memories"
    },
    {
      id: "photo-4",
      src: "/assets/IMG-20260621-WA0004.jpg",
      title: "The Glow In Your Eyes ✨",
      subtitle: "Pure warmth & innocence",
      date: "21 June 2026",
      caption: "You make ordinary days glow like pure gold. With you, every simple second feels magical.",
      category: "Portraits"
    },
    {
      id: "photo-5",
      src: "/assets/IMG-20260517-WA0001.jpg",
      title: "Close To My Heart 💖",
      subtitle: "Us, exactly where I belong",
      date: "17 May 2026",
      caption: "I may not be standing next to you right now, but your warmth lives in every heartbeat of mine.",
      category: "Together"
    },
    {
      id: "photo-6",
      src: "/assets/First meet 28-08-2026.png",
      title: "The Day We First Met 🌹",
      subtitle: "Where our universe began",
      date: "28 August 2026",
      caption: "The most sacred turning point of my life. The day destiny gifted me my Ammuuu.",
      category: "Milestones",
      objectPosition: "50% 48%"
    },
    {
      id: "photo-7",
      src: "/assets/Screenshot_20260629_004907.jpg",
      title: "Our Precious Memories 💫",
      subtitle: "Late night calls & endless laughs",
      date: "29 June 2026",
      caption: "Every call, every screenshot, every shared laugh makes this distance feel so small compared to our love.",
      category: "Memories"
    },
    {
      id: "photo-8",
      src: "/assets/file_000000001fe4821196382939e7696d36.png",
      title: "Every Picture Has a Story 📖",
      subtitle: "And every story begins with you",
      date: "Always & Forever",
      caption: "Every photograph is a treasure chest of emotions. Looking forward to filling thousands more albums with you.",
      category: "Memories"
    }
  ] as PhotoItem[],

  // Our Love Story Timeline
  timeline: [
    {
      id: "milestone-1",
      date: "28 August 2026",
      title: "The Day We First Met",
      subtitle: "The chapter that changed everything",
      description: "From the very first moment our eyes met and words were spoken, something in my heart whispered that you were someone extraordinarily special.",
      iconName: "heart",
      highlight: true,
      image: "/assets/First meet 28-08-2026.png",
      imageBadge: "✦ Holding Hands Forever",
      objectPosition: "50% 48%"
    },
    {
      id: "milestone-2",
      date: "15 July 2022",
      title: "Our First Special Memory",
      subtitle: "When you became my home",
      description: "Even when miles separated us, every message and phone call made me realize that distance could never weaken what we share. You became my safest comfort.",
      iconName: "sparkles",
      highlight: false,
      image: "/assets/Screenshot_20260629_004907.jpg",
      imageBadge: "✦ Distance Disappearing",
      objectPosition: "center 30%"
    },
    {
      id: "milestone-3",
      date: "27 September 2023",
      title: "A Favourite Moment Together",
      subtitle: "Love that grows with every sunrise",
      description: "Realizing that you are not just a part of my life, but the heartbeat of my happiness. Your laughter became my favourite sound in the whole universe.",
      iconName: "star",
      highlight: false,
      image: "/assets/video-call-cute.jpg",
      imageBadge: "✦ Your Sweetest Smile",
      objectPosition: "center 40%"
    },
    {
      id: "milestone-4",
      date: "27 October",
      title: "Happy Birthday, Mounika ❤️",
      subtitle: "Celebrating the queen of my heart",
      description: "Today is the day the world was blessed with you, my Ammuuu. Even from far away, my whole soul is celebrating you with endless love.",
      iconName: "calendar",
      highlight: true,
      image: "/assets/IMG-20260621-WA0004.jpg",
      imageBadge: "✦ Birthday Girl Mounika",
      objectPosition: "center 20%"
    },
    {
      id: "milestone-5",
      date: "Our Future Together",
      title: "Our Future Birthday Celebrations",
      subtitle: "Hand in hand, for all our years",
      description: "One day very soon, this distance will be gone forever. I will stand beside you, hold you tight, light your candles, and whisper 'Happy Birthday, Maa' right in your ear.",
      iconName: "gift",
      highlight: true,
      image: "/assets/us-together.jpg",
      imageBadge: "✦ Side By Side Forever",
      objectPosition: "center 35%"
    }
  ] as TimelineMilestone[],

  // 7 Promises for Ammuuu (Virtual Gift Box feature)
  promises: [
    {
      id: 1,
      title: "To Always Protect Your Smile",
      description: "Whenever you feel low or tired, I will do everything in my power to bring that radiant smile back to your face."
    },
    {
      id: 2,
      title: "To Close This Distance",
      description: "I promise you that this distance is only temporary. I am working towards the day we never have to say goodbye at the end of a call."
    },
    {
      id: 3,
      title: "To Always Listen & Understand",
      description: "Your feelings, fears, dreams, and silences will always be safe with me. I will always be your most patient listener."
    },
    {
      id: 4,
      title: "To Celebrate Every Win of Yours",
      description: "I will be your loudest cheerleader in everything you achieve, big or small. Your success is my pride."
    },
    {
      id: 5,
      title: "To Love You Unconditionally",
      description: "Through sunny days and stormy seasons, through easy times and hard times, my love for you will never waver."
    },
    {
      id: 6,
      title: "To Stand By You Always",
      description: "Even when I cannot physically hold your hand, my heart and soul will always be standing right beside you."
    },
    {
      id: 7,
      title: "To Make Our Future Beautiful",
      description: "Together, we will build a life filled with laughter, adventures, late night talks, and boundless happiness."
    }
  ] as PromiseItem[],

  // Surprise messages inside the virtual gift box
  giftSurprise: {
    badge: "For My Bangaram 🎁",
    headline: "You Are My Greatest Blessing, Ammuuu ❤️",
    subtext: "Inside this virtual gift box is a piece of my soul and 7 eternal promises made just for you.",
    specialNote: "Nuvvu naaku entha viluvainadanivo cheppadaniki ee prapancham lo unna words saripovu. Happy Birthday, Maa! 💖"
  }
}
