/* Data that will be obtain by call to backend
* */

/*Initial checklist list*/
const checklist_trees = [
  {
    checklist_id: 0,
    id: -1,
    num_values:[],
    values:[
      {
        id: 1,
        name: "Intubation Difficile ? ",
        section_title : "Vérifications concernant l'intubation difficile",
        cond: {"yes":[], "no":[], num:[]},
        check : ["yes","no","idk"],
        color : [0,1,2],
        pre_check : {if:[{var:"difficult_intubation",op:"est",val:"vrai"}],then:"yes"},
        values: [
          {
            id: 2,
            name: "A confirmer l'incubation difficile",
            cond: {"yes":[], "no": [], "idk" : [1], num:[]},
            check : ["yes","no"],
            color : [1,0],
            values: []
          },
          {
            id: 3,
            name: "2ème Anesthésiste",
            cond: {"yes":[1], "no":[], num:[]},
            check : ["yes","no"],
            color : [1,0],
            values: []
          },
          {
            id: 4,
            name: "2ème Infirmière",
            cond: {"yes":[1], "no":[], num:[]},
            check : ["yes","no"],
            color : [0,1],
            values: []
          },
          {
            id: 5,
            name: "Matériel",
            cond: {"yes":[1], "no":[], num:[]},
            check : [],
            values: [
              {
                id: 6,
                name: "Glidescope",
                cond: {"yes":[1], "no":[], num:[]},
                check : ["yes","no"],
                color : [0,1],
                values: []
              },
              {
                id: 7,
                name: "Laryngoscope",
                cond: {"yes":[1], "no":[], num:[]},
                check : ["yes","no"],
                color : [0,1],
                values: []
              },
              {
                id: 8,
                name: "Set Trachéo",
                cond: {"yes":[1], "no":[], num:[]},
                check : ["yes","no"],
                color : [0,1],
                values: []
              },
            ]
          },
          {
            id: 9,
            name: "Protocole",
            cond: {"yes":[1], "no":[], num:[]},
            check : ["yes","no"],
            color : [0,1],
            values: []
          },
        ]
      },
      {
        id: 10,
        name: "Est-elle susceptible d'être enceinte ?",
        section_title : "Vérifications concernant une possible grossesse",
        comment: "(Les données patient nous indiquent que la patiente est âgée entre 15 et 60 ans)",
        cond: {"yes":[], "no":[], num:[{var:"age",op:">",val:15},{var:"age",op:"<",val:60}, {var:"gender",op:"=",val:"F"}]},
        check : ["yes","no"],
        color : [0,1],
        values: [
          {
            id: 11,
            name: "Arrêt des rêgles depuis ?",
            cond: {"yes":[10], "no":[], num:[]},
            check : ["text"],
            values: []
          },
          {
            id: 12,
            name: "Test disponible ?",
            cond: {"yes":[10], "no":[], num:[]},
            check : ["yes","no"],
            color : [0,1],
            values: [
              {
                id: 13,
                name: "Négatif ?",
                cond: {"yes":[12], "no":[], num:[]},
                check : ["yes", "no"],
                color : [0,1],
                values: []
              },
              {
                id: 14,
                name: "Faire test maintenant ?",
                cond: {"yes":[], "no":[12], num:[]},
                check : ["yes", "no"],
                color : [0,1],
                values: []
              },
              {
                id: 15,
                name: "Postposer l'intervention ?",
                cond: {"yes":[], "no":[12], num:[]},
                check : ["yes", "no"],
                color : [0,1],
                values: []
              },
            ]
          },
        ]
      },
      {
        id: 16,
        name: "Le patient est-il diabétique ?",
        section_title : "Vérification concernant le diabète",
        cond: {"yes":[], "no":[], num:[]},
        check : ["yes","no"],
        color : [0,1],
        pre_check : {if:[{var:"diabetic",op:"est",val:"vrai"}],then:"yes"},
        values: [
          {
            id: 17,
            name: "Traitement Oral ?",
            cond: {"yes":[16], "no":[], num:[]},
            check : ["yes", "no"],
            color : [0,1],
            values: [
              {
                id: 18,
                name: "Arrêt des médicaments ?",
                cond: {"yes":[17], "no":[], num:[]},
                check : ["yes", "no"],
                color : [0,1],
                values: []
              },
            ]
          },
          {
            id: 19,
            name: "Traitement par piqure à insuline ?",
            cond: {"yes":[16], "no":[17], num:[]},
            check : ["yes", "no"],
            color : [0,1],
            values: [
              {
                id: 20,
                name: "Dernière piqure le ? ",
                cond : {"yes":[19], "no":[], num:[]},
                check: ["text"],
                values: []
              }
            ]
          },
          {
            id: 21,
            name: "Glycémie à l'arrivée HJ ?",
            cond: {"yes":[16], "no":[], num:[]},
            check : ["normal", "anormal"],
            color : [0,1],
            values: []
          },
        ]
      },
      {
        id: 22,
        name: "Consentement chirugicaux et anéstésiques de père/mère",
        section_title : "Concernant les consentements parentaux",
        comment: "Enfant de <15 ans, nécessite les consentement des parents",
        cond: {"yes":[],"no":[],num:[{var:"age",op:"<",val:15}]},
        check: [],
        values: [
          {
            id: 23,
            name: "Consentement chirugical du père",
            cond: {"yes":[], num:[{var:"age",op:"<",val:15}]},
            check: ["yes", "no"],
            color : [0,1],
            values: []
          },
          {
            id: 24,
            name: "Consentement chirurgical de la mère",
            cond: {"yes":[], num:[{var:"age",op:"<",val:15}]},
            check: ["yes", "no"],
            color : [0,1],
            values: []
          },
          {
            id: 25,
            name: "Consentement anestésique du père",
            cond: {"yes":[], num:[{var:"age",op:"<",val:15}]},
            check: ["yes", "no"],
            color : [0,1],
            values: []
          },
          {
            id: 26,
            name: "Consentement anestésique de la mère",
            cond: {"yes":[], num:[{var:"age",op:"<",val:15}]},
            check: ["yes", "no"],
            color : [0,1],
            values: []
          },
        ]
      },
      {
        id: 27,
        name: "Checks vernis à ongle",
        section_title : "Checks généraux pour anestésie",
        comment: "Ado/Adulte, nécessite vérification du vernis à ongle et des prothèses auditives/dentaires",
        cond: {"yes":[], num:[{var:"age",op:">",val:10}]},
        check: ["ok", "not_ok"],
        color : [0,1],
        values: [
          {
            id: 28,
            name: "Check Prothèses dentaires",
            cond: {"yes":[], num:[{var:"age",op:">",val:10}]},
            check: ["ok", "not_ok"],
            color : [0,1],
            values: []
          },
          {
            id: 29,
            name: "Check Prothèses auditives",
            cond: {"yes":[], num:[{var:"age",op:">",val:10}]},
            check: ["ok", "not_ok"],
            color : [0,1],
            values: []
          },
        ]
      },
      {
        id: 30,
        name: "Maladie transmissible ?",
        section_title : "Vérifications maladadies transmissibles",
        comment : "Si oui, l'information sera considérée dans les checklists suivantes (accueil du bloc, salle de réveil)",
        cond: {"yes":[], num:[]},
        check: ["yes", "no"],
        color : [0,1],
        values: [
          {
            id: 31,
            name: "Par voie aérienne ? ",
            cond: {"yes":[30], num:[]},
            check: ["yes", "no"],
            color : [0,1],
            values: [
              {
                id: 32,
                name : "EPI (Masque FFP2, Visière)",
                cond : {"yes":[31], num:[]},
                check: ["yes", "no"],
                color : [0,1],
                values: []
              },
              {
                id: 33,
                name : "Protocole",
                cond : {"yes":[31], num:[]},
                check: ["ok", "not_ok"],
                color : [0,1],
                values: []
              }
            ]
          },
          {
            id: 34,
            name: "Par voie sanguine ? ",
            cond: {"yes":[30], "no":[31], num:[]},
            check: ["yes", "no"],
            color : [0,1],
            values: [
              {
                id: 35,
                name : "EPI (Gants, blouses, lunettes)",
                cond : {"yes":[34], num:[]},
                check: ["yes", "no"],
                color : [0,1],
                values: []
              },
              {
                id: 36,
                name : "Protocole",
                cond : {"yes":[34], num:[]},
                check: ["ok", "not_ok"],
                color : [0,1],
                values: []
              }
            ]
          },
          {
            id: 37,
            name: "Par contact ? ",
            cond: {"yes":[30], "no":[31,34], num:[]},
            check: ["yes", "no"],
            color : [0,1],
            values: [
              {
                id: 38,
                name : "EPI",
                cond : {"yes":[37], num:[]},
                check: ["yes", "no"],
                color : [0,1],
                values: []
              },
              {
                id: 39,
                name : "Protocole",
                cond : {"yes":[37], num:[]},
                check: ["ok", "not_ok"],
                color : [0,1],
                values: []
              }
            ]
          },
        ]
      }
    ]
  },
  {
    checklist_id: 1,
    id: -1,
    num_values:[],
    values:[
      {
        id: 1,
        name: "Intubation ? ",
        cond: {"yes": [], "no": [], num: []},
        check: ["yes", "no", "?"],
        color: [0,1,2],
        pre_check: {if: [{var: "difficult_intubation", op: "est", val: "vrai"}], then: "yes"},
        values: []
      },
      {
        id: 2,
        name: "Test ? ",
        cond: {"yes": [], "no": [], num: []},
        check: ["yes", "no", "?"],
        color: [0,1,2],
        values: []
      }
    ]
  }
];

const checklist_arrays = [
  [
    [
      '"id"',
      '"name"',
      '"parent_id"',
      '"position"',
      '"comment"',
      '"section_title"',
      '"cond"',
      '"check"',
      '"color"',
      '"pre_check"'
    ],
    [
      1,
      '"Intubation Difficile ? "',
      -1,
      0,
      null,
      '"Vérifications concernant l\'intubation difficile"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","idk"]',
      '[0,1,2]',
      '{"if":[[{"var":"difficult_intubation","op":"est","val":"vrai"}]],"then":"yes"}'
    ],
    [
      2,
      '"A confirmer l\'incubation difficile"',
      1,
      0,
      null,
      null,
      '{"yes":[],"no":[],"idk":[1],"num":[]}',
      '["yes","no"]',
      '[1,0]',
      null
    ],
    [
      3,
      '"2ème Anesthésiste"',
      1,
      1,
      null,
      null,
      '{"yes":[1],"no":[],"num":[]}',
      '["yes","no"]',
      '[1,0]',
      null
    ],
    [
      4,
      '"2ème Infirmière"',
      1,
      2,
      null,
      null,
      '{"yes":[1],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      5,
      '"Matériel"',
      1,
      3,
      null,
      null,
      '{"yes":[1],"no":[],"num":[]}',
      '[]',
      null,
      null
    ],
    [
      6,
      '"Glidescope"',
      5,
      0,
      null,
      null,
      '{"yes":[1],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      7,
      '"Laryngoscope"',
      5,
      1,
      null,
      null,
      '{"yes":[1],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      8,
      '"Set Trachéo"',
      5,
      2,
      null,
      null,
      '{"yes":[1],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      9,
      '"Protocole"',
      1,
      4,
      null,
      null,
      '{"yes":[1],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      10,
      '"Est-elle susceptible d\'être enceinte ?"',
      -1,
      1,
      '"(Les données patient nous indiquent que la patiente est âgée entre 15 et 60 ans)"',
      '"Vérifications concernant une possible grossesse"',
      '{"yes":[],"no":[],"num":[{"var":"age","op":">","val":15},{"var":"age","op":"<","val":60},{"var":"gender","op":"=","val":"F"}]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      11,
      '"Arrêt des rêgles depuis ?"',
      10,
      0,
      null,
      null,
      '{"yes":[10],"no":[],"num":[]}',
      '["text"]',
      null,
      null
    ],
    [
      12,
      '"Test disponible ?"',
      10,
      1,
      null,
      null,
      '{"yes":[10],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      13,
      '"Négatif ?"',
      12,
      0,
      null,
      null,
      '{"yes":[12],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      14,
      '"Faire test maintenant ?"',
      12,
      1,
      null,
      null,
      '{"yes":[],"no":[12],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      15,
      '"Postposer l\'intervention ?"',
      12,
      2,
      null,
      null,
      '{"yes":[],"no":[12],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      16,
      '"Le patient est-il diabétique ?"',
      -1,
      2,
      null,
      '"Vérifications concernant le diabète"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      '{"if":[[{"var":"diabetic","op":"est","val":"vrai"}]],"then":"yes"}'
    ],
    [
      17,
      '"Traitement Oral ?"',
      16,
      0,
      null,
      null,
      '{"yes":[16],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      18,
      '"Arrêt des médicaments ?"',
      17,
      0,
      null,
      null,
      '{"yes":[17],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      19,
      '"Traitement par piqure à insuline ?"',
      16,
      1,
      null,
      null,
      '{"yes":[16],"no":[17],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      20,
      '"Dernière piqure le ? "',
      19,
      0,
      null,
      null,
      '{"yes":[19],"no":[],"num":[]}',
      '["text"]',
      null,
      null
    ],
    [
      21,
      '"Glycémie à l\'arrivée HJ ?"',
      16,
      2,
      null,
      null,
      '{"yes":[16],"no":[],"num":[]}',
      '["normal","anormal"]',
      '[0,1]',
      null
    ],
    [
      22,
      '"Consentement chirugicaux et anéstésiques de père/mère"',
      -1,
      3,
      '"Enfant de <15 ans, nécessite les consentement des parents"',
      '"Vérifications concernant les consentements"',
      '{"yes":[],"no":[],"num":[{"var":"age","op":"<","val":15}]}',
      '[]',
      null,
      null
    ],
    [
      23,
      '"Consentement chirugical du père"',
      22,
      0,
      null,
      null,
      '{"yes":[],"num":[{"var":"age","op":"<","val":15}]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      24,
      '"Consentement chirurgical de la mère"',
      22,
      1,
      null,
      null,
      '{"yes":[],"num":[{"var":"age","op":"<","val":15}]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      25,
      '"Consentement anestésique du père"',
      22,
      2,
      null,
      null,
      '{"yes":[],"num":[{"var":"age","op":"<","val":15}]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      26,
      '"Consentement anestésique de la mère"',
      22,
      3,
      null,
      null,
      '{"yes":[],"num":[{"var":"age","op":"<","val":15}]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      27,
      '"Checks vernis à ongle"',
      -1,
      4,
      '"Ado/Adulte, nécessite vérification du vernis à ongle et des prothèses auditives/dentaires"',
      '"Checks généraux pour anestésie"',
      '{"yes":[],"num":[{"var":"age","op":">","val":10}]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      28,
      '"Check Prothèses dentaires"',
      27,
      0,
      null,
      null,
      '{"yes":[],"num":[{"var":"age","op":">","val":10}]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      29,
      '"Check Prothèses auditives"',
      27,
      1,
      null,
      null,
      '{"yes":[],"num":[{"var":"age","op":">","val":10}]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      30,
      '"Maladie transmissible ?"',
      -1,
      5,
      '"Si oui, l\'information sera considérée dans les checklists suivantes (accueil du bloc, salle de réveil)"',
      '"Vérifications maladadies transmissibles"',
      '{"yes":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      31,
      '"Par voie aérienne ? "',
      30,
      0,
      null,
      null,
      '{"yes":[30],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      '{"if":[[{"val":"yes","var":34},{"val":"yes","var":37}]],"then":"no"}'
    ],
    [
      32,
      '"EPI (Masque FFP2, Visière)"',
      31,
      0,
      null,
      null,
      '{"yes":[31],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      33,
      '"Protocole"',
      31,
      1,
      null,
      null,
      '{"yes":[31],"num":[]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      34,
      '"Par voie sanguine ? "',
      30,
      1,
      null,
      null,
      '{"yes":[30],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      '{"if":[[{"val":"yes","var":31},{"val":"yes","var":37}]],"then":"no"}'
    ],
    [
      35,
      '"EPI (Gants, blouses, lunettes)"',
      34,
      0,
      null,
      null,
      '{"yes":[34],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      36,
      '"Protocole"',
      34,
      1,
      null,
      null,
      '{"yes":[34],"num":[]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      37,
      '"Par contact ? "',
      30,
      2,
      null,
      null,
      '{"yes":[30],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      '{"if":[[{"var":31,"val":"yes"},{"val":"yes","var":34}]],"then":"no"}'
    ],
    [
      38,
      '"EPI"',
      37,
      0,
      null,
      null,
      '{"yes":[37],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      39,
      '"Protocole"',
      37,
      1,
      null,
      null,
      '{"yes":[37],"num":[]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      40,
      '"Autre moyen de transmission"',
      30,
      3,
      null,
      null,
      '{"yes":[30],"no":[31,34,37],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ],
    // [
    //   40,
    //   '"Médicament"',
    //   -1,
    //   6,
    //   null,
    //   null,
    //   '{"yes":[],"num":[]}',
    //   '["list_meds"]',
    //   '[]',
    //   null
    // ]
  ],
  [
    [
      '"id"',
      '"name"',
      '"parent_id"',
      '"position"',
      '"comment"',
      '"section_title"',
      '"cond"',
      '"check"',
      '"color"',
      '"pre_check"'
    ],
    [
      1,
      '"Intubation Difficile ? "',
      -1,
      0,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","idk"]',
      '[0,1,2]',
      '{"if":[[{"var":"difficult_intubation","op":"est","val":"vrai"}]],"then":"yes"}'
    ],
  ],
  [
    [
      '"id"',
      '"name"',
      '"parent_id"',
      '"position"',
      '"comment"',
      '"section_title"',
      '"cond"',
      '"check"',
      '"color"',
      '"pre_check"'
    ],
    [
      1,
      '"Intervention urgente"',
      -1,
      0,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[1,0,2]',
      null
    ],
    [
      2,
      '"Dossier infirmier présent"',
      -1,
      1,
      null,
      '"Infirmière de l\'unité de soin qui prépare le patient"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      3,
      '"Patient (A=conscient, B=inconscient, C=dément)"',
      -1,
      2,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["a","b","c"]',
      '[2,2,2,2,2]',
      null
    ],
    [
      4,
      '"Patient"',
      -1,
      3,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["list_patient-states"]',
      '[0,1]',
      null
    ],
    [
      5,
      '"Le patient décline son nom"',
      -1,
      4,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      6,
      '"Le patient décline son prénom "',
      -1,
      5,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      7,
      '"Le patient décline sa date de naissance"',
      -1,
      6,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      8,
      '"Vérifier la concordance entre le dossier et le bracelet d\'identité du patient"',
      -1,
      7,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      9,
      '"Consentement du patient/parent <18 ans"',
      -1,
      8,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      10,
      '"Le patient décline le côté à opérer"',
      -1,
      9,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["left","right","na"]',
      '[2,2,2,2,2]',
      null
    ],
    [
      11,
      '"L\'infirmière vérifie dans le dossier le type d\'intervention"',
      -1,
      10,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      12,
      '"Maladies transmissibles connues"',
      -1,
      11,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["list_diseases"]',
      '[0,1]',
      null
    ],
    [
      13,
      '"Patient(e) à jeun"',
      -1,
      12,
      null,
      '"À vérifier"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      14,
      '"Vernis à ongle ôté"',
      -1,
      13,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      15,
      '"A uriné"',
      -1,
      14,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      16,
      '"Proth. dentaire/auditives/lentilles ôtées"',
      -1,
      15,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      17,
      '"Bijoux/piercings ôtés"',
      -1,
      16,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      18,
      '"Médicamenteuses"',
      -1,
      17,
      null,
      '"Le patient déclare ses allergies"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      19,
      '"Lesquelles ?"',
      -1,
      18,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["list_alergy-meds"]',
      '[0,1,2]',
      null
    ],
    [
      20,
      '"Alimentaires"',
      -1,
      19,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      21,
      '"Lesquelles ?"',
      -1,
      20,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["list_alergy-aliments"]',
      '[0,1]',
      null
    ],
    [
      22,
      '"Hygiène du patient correcte"',
      -1,
      21,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      23,
      '"Propreté et intégrité du site opératoire"',
      -1,
      22,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      24,
      '"Dépilation"',
      -1,
      23,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      25,
      '"Présence de bas de contention"',
      -1,
      24,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      26,
      '"Nom"',
      -1,
      25,
      null,
      '"Infirmière de l\'US qui a préparé le patient pour le BO "',
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ]
  ],
  [
    [
      '"id"',
      '"name"',
      '"parent_id"',
      '"position"',
      '"comment"',
      '"section_title"',
      '"cond"',
      '"check"',
      '"color"',
      '"pre_check"'
    ],
    [
      1,
      '"Intervention Urgente"',
      -1,
      0,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[1,0,2]',
      null
    ],
    [
      2,
      '"Dossier infirmier présent"',
      -1,
      1,
      null,
      '"Infirmière BO qui accueille le patient"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      3,
      '"Patient (A=conscient, B=inconscient, C=dément)"',
      -1,
      2,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["a","b","c"]',
      '[2,2,2,2,2]',
      null
    ],
    [
      4,
      '"Le patient décline son nom"',
      -1,
      3,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      5,
      '"Le patient décline son prénom"',
      -1,
      4,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      6,
      '"Le patient décline sa date de naissance"',
      -1,
      5,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      7,
      '"Vérifier la concordance entre le dossier et le bracelet d\'identité du patient "',
      -1,
      6,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["ok","not_ok"]',
      '[0,1]',
      null
    ],
    [
      8,
      '"Consentement du patient/d\'un parent <18 ans"',
      -1,
      7,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      9,
      '"Le patient décline le côté à opérer"',
      -1,
      8,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["left","right","na"]',
      '[2,2,2,2]',
      null
    ],
    [
      10,
      '"L\'infirmière vérifie dans le dossier le type d\'intervention"',
      -1,
      9,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["ok", "not_ok"]',
      '[0,1,2]',
      null
    ],
    [
      11,
      '"Maladies transmissibles connues"',
      -1,
      10,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[1,0]',
      null
    ],
    [
      12,
      '"Lesquelles ?"',
      -1,
      11,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["list_diseases"]',
      '[0,1]',
      null
    ],
    [
      13,
      '"Patient(e) à jeun"',
      -1,
      12,
      null,
      '"À vérifier"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      14,
      '"Vernis à ongles ôté"',
      -1,
      13,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      15,
      '"A uriné"',
      -1,
      14,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      16,
      '"Proth. dentaires/auditives/lentilles ôtées"',
      -1,
      15,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      17,
      '"Bijoux/piercings ôtés"',
      -1,
      16,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      18,
      '"Médicamenteuses"',
      -1,
      17,
      null,
      '"Le patient déclare ses allergies :"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[1,0,2]',
      null
    ],
    [
      19,
      '"Lesquelles ?"',
      -1,
      18,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["list_alergy-meds"]',
      '[0,1]',
      null
    ],
    [
      20,
      '"Alimentaires"',
      -1,
      19,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[1,0,2]',
      null
    ],
    [
      21,
      '"Lesquelles ?"',
      -1,
      20,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["list_alergy-aliments"]',
      '[0,1]',
      null
    ],
    [
      22,
      '"Hygiène du patient correcte"',
      -1,
      21,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      23,
      '"Propreté et intégrité du site opératoire"',
      -1,
      22,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      24,
      '"Dépilation"',
      -1,
      23,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      25,
      '"Présence de bas de contention"',
      -1,
      24,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      26,
      '"Nom"',
      -1,
      25,
      null,
      '"Infirmière qui accueille le patient au BO :"',
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ]
  ],
  [
    [
      '"id"',
      '"name"',
      '"parent_id"',
      '"position"',
      '"comment"',
      '"section_title"',
      '"cond"',
      '"check"',
      '"color"',
      '"pre_check"'
    ],
    [
      1,
      '"Date de l\'intervention"',
      -1,
      0,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1,2]',
      '{"if":[[{"var":"difficult_intubation","op":"est","val":"vrai"}]],"then":"yes"}'
    ],
    [
      2,
      '"Salle "',
      -1,
      1,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ],
    [
      3,
      '"Présentation des perso..."',
      -1,
      2,
      null,
      '"Chirurgien / Inf. circul. / Instrumentaliste / Anesthésiste"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      4,
      '"Vérification identité du...."',
      -1,
      3,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      5,
      '"Rappel de l\'intitulé de l..."',
      -1,
      4,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      6,
      '"Site opératoire"',
      -1,
      5,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["left","right","na"]',
      '[2,2,2,2,2]',
      null
    ],
    [
      7,
      '"Maladies transmissibles"',
      -1,
      6,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[1,0]',
      null
    ],
    [
      8,
      '"Risque de perte sanguine... Si oui, des poches de sang..."',
      -1,
      7,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[1,0,2]',
      null
    ],
    [
      9,
      '"Vérif. administr. AB Prophyl."',
      -1,
      8,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[0,1,2]',
      null
    ],
    [
      10,
      '"Heure"',
      -1,
      9,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ],
    [
      11,
      '"Matériel d\'anesthésie disponible / ordre de marche"',
      -1,
      10,
      null,
      '"Anésthesiste"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      12,
      '"Respirateur"',
      -1,
      11,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      13,
      '"Oxym. de pouls"',
      -1,
      12,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      14,
      '"Monitoring"',
      -1,
      13,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      15,
      '"Difficultés airways et/ou intubation"',
      -1,
      14,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","na"]',
      '[1,0,2]',
      null
    ],
    [
      16,
      '"Si oui, glydescope ou équivalent présent"',
      -1,
      15,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      17,
      '"Matériel pour l\'infirmière circulante disponible et en ordre de marche (laryngoscope, ...)"',
      -1,
      16,
      null,
      '"Infirmière circulante"',
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      18,
      '"La stérilité du matériel disposable et non disposable a été vérifiée (résultats des indicateurs + vérification date péremption)"',
      -1,
      17,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      19,
      '"Induction - Nom "',
      -1,
      18,
      null,
      '"Anesthésistes"',
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ],
    [
      20,
      '"Réveil - Nom"',
      -1,
      19,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ],
    [
      21,
      '"Si changement - Nom"',
      -1,
      20,
      null,
      null,
      '{"yes":[],"no":[],"num":[]}',
      '["text"]',
      '[0,1]',
      null
    ]
  ]
]

const checklist_list = [
  {checklist_id: 0, name: "Principale"},
  {checklist_id: 1, name: "Seconde"},
  {checklist_id: 2, name: "Unité de soin", person: "Inf. de l'US qui prépare le patient "},
  {checklist_id: 3, name: "Accueil Patient BO", person: "Inf. BO qui accueille le patient"},
  {checklist_id: 4, name: "Avant Induction Anésthésique", person: "Chirurgien/Inf. \n Circul./Instrumentiste/Anésthésiste"}
]


/*List of all patients*/
const patients = [
  {"id": 0, "lastname": "Dubois", "firstname": "Germaine", "gender": "F", "dateofbirth": "02/11/1940", "diabetic":"faux", "difficult_intubation":"vrai"  },
  {"id": 1, "lastname": "Vandamme", "firstname": "Gilbert", "gender": "M", "dateofbirth": "08/25/1960", "diabetic":"vrai", "difficult_intubation":"vrai" },
  {"id": 2, "lastname": "Perlot", "firstname": "Claude", "gender": "M", "dateofbirth": "12/16/1975", "diabetic":"faux", "difficult_intubation":"faux" },
  {"id": 3, "lastname": "Boulet", "firstname": "Arnaud", "gender": "M", "dateofbirth": "03/17/1981", "diabetic":"faux", "difficult_intubation":"faux" },
  {"id": 4, "lastname": "Charlier", "firstname": "Emile", "gender": "M", "dateofbirth": "09/19/1953", "diabetic":"faux", "difficult_intubation":"vrai" },
  {"id": 5, "lastname": "Nash", "firstname": "Emilie", "gender": "F", "dateofbirth": "03/30/2015", "diabetic":"vrai", "difficult_intubation":"vrai" },
  {"id": 6, "lastname": "Materne", "firstname": "Marie", "gender": "F", "dateofbirth": "08/23/1982", "diabetic":"faux", "difficult_intubation":"faux" },
  {"id": 7, "lastname": "Bernard", "firstname": "Virginie", "gender": "F", "dateofbirth": "06/03/1986", "diabetic":"faux", "difficult_intubation":"faux" },
  {"id": 8, "lastname": "Lemoine", "firstname": "Karine", "gender": "F", "dateofbirth": "01/25/1977", "diabetic":"vrai", "difficult_intubation":"vrai" },
]

const lists = {
  "meds": ["Mc","Lis","Kl","Eft", "Aucun"],
  "diseases": ["Covid","Grippe","Pneumonie", "Aucune"],
  "patient-states" : ["Conscient","Inconscient","Dément"],
  "alergy-meds" : ["Latex","Peniciline","Insuline", "Ibuprofène", "Aucune"],
  "alergy-aliments" : ["Gluten","Lactose","Arachides", "Aucune"]
}

const lists_trad = {"meds":"Médicaments", "diseases":"Maladies", "patient-states":"Etats Patients", "alergy-meds":"Allergies Médicamenteuses", "alergy-aliments":"Allergies Alimentaires"}

const alerts = [
  {"id":0, "question_id":1, "info": "Réponse précedente problèmatique", "gravity":0},
  {"id":1, "question_id":6, "info": "Réponse précedente positive, mais nécessite recheck", "gravity":1},
  {"id":2, "question_id":28, "info": "Réponse précedente positive, mais nécessite recheck","gravity":1},
  {"id":3, "question_id":30, "info": "Réponse précedente problèmatique","gravity":2}
]

export {checklist_trees, checklist_arrays, checklist_list, patients, lists, lists_trad, alerts}