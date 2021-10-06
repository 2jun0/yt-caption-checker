const langs = [
  {
    "code": "gl",
    "displayName": "Galego"
  },
  {
    "code": "gn",
    "displayName": "Avañe'ẽ"
  },
  {
    "code": "yue",
    "displayName": "粵語"
  },
  {
    "code": "yue-HK",
    "displayName": "粵語(香港)"
  },
  {
    "code": "gu",
    "displayName": "ગુજરાતી"
  },
  {
    "code": "el",
    "displayName": "ελληνικά"
  },
  {
    "code": "kl",
    "displayName": "kalaallisut"
  },
  {
    "code": "nv",
    "displayName": "Diné bizaad"
  },
  {
    "code": "na",
    "displayName": "Dorerin Naoero"
  },
  {
    "code": "st",
    "displayName": "Sesotho"
  },
  {
    "code": "nl",
    "displayName": "Nederlands"
  },
  {
    "code": "nl-NL",
    "displayName": "Nederlands(Nederland)"
  },
  {
    "code": "nl-BE",
    "displayName": "Nederlands(Belgium)"
  },
  {
    "code": "ne",
    "displayName": "नेपाली"
  },
  {
    "code": "no",
    "displayName": "Norsk"
  },
  {
    "code": "da",
    "displayName": "dansk"
  },
  {
    "code": "doi",
    "displayName": "डोगरी"
  },
  {
    "code": "de",
    "displayName": "Deutsch"
  },
  {
    "code": "de-DE",
    "displayName": "Deutsch(Deutschland)"
  },
  {
    "code": "de-CH",
    "displayName": "Deutsch(Swiss)"
  },
  {
    "code": "de-AT",
    "displayName": "Deutsch(Österreich)"
  },
  {
    "code": "lad",
    "displayName": "Judeo-Spanish/Ladino"
  },
  {
    "code": "lo",
    "displayName": "ພາສາລາວ"
  },
  {
    "code": "lv",
    "displayName": "latviešu valoda"
  },
  {
    "code": "la",
    "displayName": "latine"
  },
  {
    "code": "ru",
    "displayName": "русский"
  },
  {
    "code": "ru-Latn",
    "displayName": "русский(Latin)"
  },
  {
    "code": "rm",
    "displayName": "Rumantsch Grischun"
  },
  {
    "code": "ro",
    "displayName": "Română"
  },
  {
    "code": "mo",
    "displayName": "Română(Moldova)"
  },
  {
    "code": "lus",
    "displayName": "Mizo ṭawng"
  },
  {
    "code": "lb",
    "displayName": "Lëtzebuergesch"
  },
  {
    "code": "rn",
    "displayName": "Ikirundi"
  },
  {
    "code": "rw",
    "displayName": "Ikinyarwanda"
  },
  {
    "code": "lt",
    "displayName": "lietuvių kalba"
  },
  {
    "code": "ln",
    "displayName": "Lingála"
  },
  {
    "code": "mni",
    "displayName": "ꯃꯤꯇꯩꯂꯣꯟ"
  },
  {
    "code": "mr",
    "displayName": "मराठी"
  },
  {
    "code": "mas",
    "displayName": "ɔl Maa"
  },
  {
    "code": "mi",
    "displayName": "te reo Māori"
  },
  {
    "code": "mai",
    "displayName": "मैथिली"
  },
  {
    "code": "mk",
    "displayName": "македонски јазик"
  },
  {
    "code": "mg",
    "displayName": "fiteny malagasy"
  },
  {
    "code": "ml",
    "displayName": "മലയാളം"
  },
  {
    "code": "ms",
    "displayName": "Bahasa Melayu"
  },
  {
    "code": "mt",
    "displayName": "Malti"
  },
  {
    "code": "mn",
    "displayName": "Монгол хэл"
  },
  {
    "code": "mn-Mong",
    "displayName": "Монгол хэл(ᠮᠣᠩᠭᠣᠯᠪᠢᠴᠢᠭ᠌)"
  },
  {
    "code": "mxp",
    "displayName": "Ayuujk"
  },
  {
    "code": "nan",
    "displayName": "閩語"
  },
  {
    "code": "nan-TW",
    "displayName": "閩語(臺灣)"
  },
  {
    "code": "ba",
    "displayName": "башҡорт теле"
  },
  {
    "code": "eu",
    "displayName": "euskara"
  },
  {
    "code": "my",
    "displayName": "ဗမာစာ"
  },
  {
    "code": "vi",
    "displayName": "Tiếng Việt"
  },
  {
    "code": "ve",
    "displayName": "Tshivenḓa"
  },
  {
    "code": "be",
    "displayName": "беларуская мова"
  },
  {
    "code": "bn",
    "displayName": "বাংলা"
  },
  {
    "code": "brx",
    "displayName": "बर'"
  },
  {
    "code": "bs",
    "displayName": "bosanski jezik"
  },
  {
    "code": "vo",
    "displayName": "Volapük"
  },
  {
    "code": "bg",
    "displayName": "български език"
  },
  {
    "code": "br",
    "displayName": "brezhoneg"
  },
  {
    "code": "bi",
    "displayName": "Bislama"
  },
  {
    "code": "sc",
    "displayName": "sardu"
  },
  {
    "code": "sm",
    "displayName": "gagana fa'a Samoa"
  },
  {
    "code": "sg",
    "displayName": "yângâ tî sängö"
  },
  {
    "code": "sa",
    "displayName": "संस्कृतम्"
  },
  {
    "code": "sat",
    "displayName": "ᱥᱟᱱᱛᱟᱲᱤ"
  },
  {
    "code": "fy",
    "displayName": "Frysk"
  },
  {
    "code": "sr",
    "displayName": "српски језик"
  },
  {
    "code": "sr-Latn",
    "displayName": "српски језик(Latin)"
  },
  {
    "code": "sr-Cyrl",
    "displayName": "српски језик(Cyrillic)"
  },
  {
    "code": "so",
    "displayName": "Soomaaliga"
  },
  {
    "code": "sn",
    "displayName": "chiShona"
  },
  {
    "code": "su",
    "displayName": "Basa Sunda"
  },
  {
    "code": "sw",
    "displayName": "Kiswahili"
  },
  {
    "code": "sv",
    "displayName": "Svenska"
  },
  {
    "code": "gd",
    "displayName": "Gàidhlig"
  },
  {
    "code": "es",
    "displayName": "Español"
  },
  {
    "code": "es-419",
    "displayName": "Español(América Latina)"
  },
  {
    "code": "es-MX",
    "displayName": "Español(México)"
  },
  {
    "code": "es-US",
    "displayName": "Español(US)"
  },
  {
    "code": "es-ES",
    "displayName": "Español(Español)"
  },
  {
    "code": "sk",
    "displayName": "Slovenčina"
  },
  {
    "code": "sl",
    "displayName": "Slovenski jezik"
  },
  {
    "code": "ss",
    "displayName": "SiSwati"
  },
  {
    "code": "scn",
    "displayName": "Sicilianu"
  },
  {
    "code": "sd",
    "displayName": "सिंधी"
  },
  {
    "code": "si",
    "displayName": "සිංහල"
  },
  {
    "code": "arc",
    "displayName": "ܐܪܡܝܐ"
  },
  {
    "code": "ar",
    "displayName": "العربية"
  },
  {
    "code": "hy",
    "displayName": "Հայերեն"
  },
  {
    "code": "as",
    "displayName": "অসমীয়া"
  },
  {
    "code": "ay",
    "displayName": "aymar aru"
  },
  {
    "code": "is",
    "displayName": "Íslenska"
  },
  {
    "code": "ht",
    "displayName": "Kreyòl ayisyen"
  },
  {
    "code": "ga",
    "displayName": "Gaeilge"
  },
  {
    "code": "az",
    "displayName": "azərbaycan dili"
  },
  {
    "code": "akk",
    "displayName": "lišānum"
  },
  {
    "code": "aa",
    "displayName": "Afaraf"
  },
  {
    "code": "af",
    "displayName": "Afrikaans"
  },
  {
    "code": "sq",
    "displayName": "Shqip"
  },
  {
    "code": "am",
    "displayName": "አማርኛ"
  },
  {
    "code": "ab",
    "displayName": "аҧсуа бызшәа"
  },
  {
    "code": "et",
    "displayName": "eesti"
  },
  {
    "code": "eo",
    "displayName": "Esperanto"
  },
  {
    "code": "en",
    "displayName": "English"
  },
  {
    "code": "en-US",
    "displayName": "English(US)"
  },
  {
    "code": "en-IE",
    "displayName": "English(Ireland)"
  },
  {
    "code": "en-GB",
    "displayName": "English(UK)"
  },
  {
    "code": "en-IN",
    "displayName": "English(India)"
  },
  {
    "code": "en-CA",
    "displayName": "English(Canada)"
  },
  {
    "code": "om",
    "displayName": "Afaan Oromoo"
  },
  {
    "code": "or",
    "displayName": "ଓଡ଼ିଆ"
  },
  {
    "code": "oc",
    "displayName": "occitan"
  },
  {
    "code": "yo",
    "displayName": "Yorùbá"
  },
  {
    "code": "ur",
    "displayName": "اردو"
  },
  {
    "code": "uz",
    "displayName": "Oʻzbek"
  },
  {
    "code": "uk",
    "displayName": "Українська"
  },
  {
    "code": "wo",
    "displayName": "Wollof"
  },
  {
    "code": "cy",
    "displayName": "Cymraeg"
  },
  {
    "code": "ug",
    "displayName": "ئۇيغۇرچە‎"
  },
  {
    "code": "yi",
    "displayName": "ייִדיש"
  },
  {
    "code": "ig",
    "displayName": "Asụsụ Igbo"
  },
  {
    "code": "ik",
    "displayName": "Iñupiaq"
  },
  {
    "code": "iu",
    "displayName": "ᐃᓄᒃᑎᑐᑦ"
  },
  {
    "code": "it",
    "displayName": "Italiano"
  },
  {
    "code": "id",
    "displayName": "Bahasa Indonesia"
  },
  {
    "code": "ia",
    "displayName": "Interlingua"
  },
  {
    "code": "ie",
    "displayName": "Interlingue"
  },
  {
    "code": "ja",
    "displayName": "日本語"
  },
  {
    "code": "jv",
    "displayName": "ꦧꦱꦗꦮ"
  },
  {
    "code": "ka",
    "displayName": "ქართული"
  },
  {
    "code": "dz",
    "displayName": "རྫོང་ཁ"
  },
  {
    "code": "zu",
    "displayName": "isiZulu"
  },
  {
    "code": "zh",
    "displayName": "中文"
  },
  {
    "code": "zh-Hans",
    "displayName": "中文(简体)"
  },
  {
    "code": "zh-TW",
    "displayName": "中文(臺灣)"
  },
  {
    "code": "zh-Hant",
    "displayName": "中文(繁體)"
  },
  {
    "code": "zh-SG",
    "displayName": "中文(Singapore)"
  },
  {
    "code": "zh-CN",
    "displayName": "中文(中国)"
  },
  {
    "code": "zh-HK",
    "displayName": "中文(香港)"
  },
  {
    "code": "chr",
    "displayName": "ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ"
  },
  {
    "code": "cs",
    "displayName": "čeština"
  },
  {
    "code": "cho",
    "displayName": "Chahta"
  },
  {
    "code": "ts",
    "displayName": "Xitsonga"
  },
  {
    "code": "tn",
    "displayName": "Setswana"
  },
  {
    "code": "ks",
    "displayName": "कॉशुर"
  },
  {
    "code": "kk",
    "displayName": "қазақ тілі"
  },
  {
    "code": "ca",
    "displayName": "català"
  },
  {
    "code": "kn",
    "displayName": "ಕನ್ನಡ"
  },
  {
    "code": "qu",
    "displayName": "Runa Simi"
  },
  {
    "code": "co",
    "displayName": "corsu"
  },
  {
    "code": "xh",
    "displayName": "isiXhosa"
  },
  {
    "code": "kok",
    "displayName": "कोंकणी"
  },
  {
    "code": "cop",
    "displayName": "Ⲙⲉⲧⲣⲉⲙ̀ⲛⲭⲏⲙⲓ"
  },
  {
    "code": "ku",
    "displayName": "Kurdî"
  },
  {
    "code": "hr",
    "displayName": "hrvatski jezik"
  },
  {
    "code": "cr",
    "displayName": "ᓀᐦᐃᔭᐍᐏᐣ"
  },
  {
    "code": "km",
    "displayName": "ភាសាខ្មែរ"
  },
  {
    "code": "tlh",
    "displayName": "tlhIngan Hol"
  },
  {
    "code": "ky",
    "displayName": "Кыргызча"
  },
  {
    "code": "tl",
    "displayName": "Wikang Tagalog"
  },
  {
    "code": "ta",
    "displayName": "தமிழ்"
  },
  {
    "code": "tg",
    "displayName": "тоҷикӣ"
  },
  {
    "code": "tt",
    "displayName": "татар теле"
  },
  {
    "code": "th",
    "displayName": "ไทย"
  },
  {
    "code": "tr",
    "displayName": "Türkçe"
  },
  {
    "code": "te",
    "displayName": "తెలుగు"
  },
  {
    "code": "tpi",
    "displayName": "Tok Pisin"
  },
  {
    "code": "to",
    "displayName": "Faka Tonga"
  },
  {
    "code": "tk",
    "displayName": "Türkmen"
  },
  {
    "code": "tw",
    "displayName": "Twi"
  },
  {
    "code": "ti",
    "displayName": "ትግርኛ"
  },
  {
    "code": "bo",
    "displayName": "བོད་ཡིག"
  },
  {
    "code": "ps",
    "displayName": "پښتو"
  },
  {
    "code": "pap",
    "displayName": "Papiamentu"
  },
  {
    "code": "pa",
    "displayName": "ਪੰਜਾਬੀ"
  },
  {
    "code": "fo",
    "displayName": "føroyskt"
  },
  {
    "code": "fa",
    "displayName": "فارسی"
  },
  {
    "code": "fa-AF",
    "displayName": "فارسی(افغانستان)"
  },
  {
    "code": "fa-IR",
    "displayName": "فارسی(ایران)"
  },
  {
    "code": "pt",
    "displayName": "Português"
  },
  {
    "code": "pt-BR",
    "displayName": "Português(Brasil)"
  },
  {
    "code": "pt-PT",
    "displayName": "Português(Portugal)"
  },
  {
    "code": "pl",
    "displayName": "język polski"
  },
  {
    "code": "ff",
    "displayName": "Fulfulde"
  },
  {
    "code": "fr",
    "displayName": "français"
  },
  {
    "code": "fr-BE",
    "displayName": "français(Belgium)"
  },
  {
    "code": "fr-CH",
    "displayName": "français(Swiss)"
  },
  {
    "code": "fr-CA",
    "displayName": "français(Canada)"
  },
  {
    "code": "fr-FR",
    "displayName": "français(française)"
  },
  {
    "code": "fj",
    "displayName": "vosa Vakaviti"
  },
  {
    "code": "fi",
    "displayName": "suomi"
  },
  {
    "code": "fil",
    "displayName": "Filipino"
  },
  {
    "code": "haw",
    "displayName": "ʻŌlelo Hawaiʻi"
  },
  {
    "code": "ha",
    "displayName": "(Hausa) هَوُسَ"
  },
  {
    "code": "hak",
    "displayName": "客家话"
  },
  {
    "code": "hak-TW",
    "displayName": "客家話(臺灣)"
  },
  {
    "code": "ko",
    "displayName": "한국어"
  },
  {
    "code": "hu",
    "displayName": "magyar"
  },
  {
    "code": "bh",
    "displayName": "বাংলা"
  },
  {
    "code": "ho",
    "displayName": "Hiri Motu"
  },
  {
    "code": "iw",
    "displayName": "עברית"
  },
  {
    "code": "hi",
    "displayName": "हिन्दी"
  },
  {
    "code": "hi-Latn",
    "displayName": "हिन्दी(Latin)"
  },
  {
    "code": "ase",
    "displayName": "ase"
  },
  {
    "code": "vro",
    "displayName": "vro"
  }
]

export {langs};