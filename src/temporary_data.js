/* Data that will be obtain by call to backend
* */

/*Initial checklist list*/
const checklist_list = [
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

const checklist_list_array = [
  [
    [
      '"id"',
      '"name"',
      '"parent_id"',
      '"position"',
      '"comment"',
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
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","idk"]',
      '[0,1,2]',
      '{"if":[{"var":"difficult_intubation","op":"est","val":"vrai"}],"then":"yes"}'
    ],
    [
      2,
      '"A confirmer l\'incubation difficile"',
      1,
      0,
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
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      '{"if":[{"var":"diabetic","op":"est","val":"vrai"}],"then":"yes"}'
    ],
    [
      17,
      '"Traitement Oral ?"',
      16,
      0,
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
      '{"yes":[30],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      32,
      '"EPI (Masque FFP2, Visière)"',
      31,
      0,
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
      '{"yes":[30],"no":[31],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      35,
      '"EPI (Gants, blouses, lunettes)"',
      34,
      0,
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
      '{"yes":[30],"no":[31,34],"num":[]}',
      '["yes","no"]',
      '[0,1]',
      null
    ],
    [
      38,
      '"EPI"',
      37,
      0,
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
      '{"yes":[37],"num":[]}',
      '["ok","not_ok"]',
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
      '{"yes":[],"no":[],"num":[]}',
      '["yes","no","idk"]',
      '[0,1,2]',
      '{"if":[{"var":"difficult_intubation","op":"est","val":"vrai"}],"then":"yes"}'
    ],
    [
      2,
      '"A confirmer l\'incubation difficile"',
      1,
      0,
      null,
      '{"yes":[],"no":[],"idk":[1],"num":[]}',
      '["yes","no"]',
      '[1,0]',
      null
    ],
  ]
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


export {checklist_list, checklist_list_array, patients}