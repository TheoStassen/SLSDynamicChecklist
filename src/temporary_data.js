/* Data that will be obtain by call to backend
* */

/*Initial checklist list*/
const checklist_list = [
  {
    checklist_id: 0,
    id: -1,
    num_values:[
    ],
    values:[
      {
        id: 1,
        name: "Intubation Difficile ? ",
        section_title : "Vérifications concernant l'intubation difficile",
        cond: {"yes":[], "no":[], num:[]},
        check : ["yes","no","idk"],
        pre_check : {if:[{var:"difficult_intubation",op:"est",val:"vrai"}],then:"yes"},
        values: [
          {
            id: 2,
            name: "A confirmer l'incubation difficile",
            cond: {"yes":[], "no": [], "idk" : [1], num:[]},
            check : ["yes","no"],
            values: []
          },
          {
            id: 3,
            name: "2ème Anesthésiste",
            cond: {"yes":[1], "no":[], num:[]},
            check : ["yes","no"],
            values: []
          },
          {
            id: 4,
            name: "2ème Infirmière",
            cond: {"yes":[1], "no":[], num:[]},
            check : ["yes","no"],
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
                values: []
              },
              {
                id: 7,
                name: "Laryngoscope",
                cond: {"yes":[1], "no":[], num:[]},
                check : ["yes","no"],
                values: []
              },
              {
                id: 8,
                name: "Set Trachéo",
                cond: {"yes":[1], "no":[], num:[]},
                check : ["yes","no"],
                values: []
              },
            ]
          },
          {
            id: 9,
            name: "Protocole",
            cond: {"yes":[1], "no":[], num:[]},
            check : ["yes","no"],
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
            values: [
              {
                id: 13,
                name: "Négatif ?",
                cond: {"yes":[12], "no":[], num:[]},
                check : ["yes", "no"],
                values: []
              },
              {
                id: 14,
                name: "Faire test maintenant ?",
                cond: {"yes":[], "no":[12], num:[]},
                check : ["yes", "no"],
                values: []
              },
              {
                id: 15,
                name: "Postposer l'intervention ?",
                cond: {"yes":[], "no":[12], num:[]},
                check : ["yes", "no"],
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
        pre_check : {if:[{var:"diabetic",op:"est",val:"vrai"}],then:"yes"},
        values: [
          {
            id: 17,
            name: "Traitement Oral ?",
            cond: {"yes":[16], "no":[], num:[]},
            check : ["yes", "no"],
            values: [
              {
                id: 18,
                name: "Arrêt des médicaments ?",
                cond: {"yes":[17], "no":[], num:[]},
                check : ["yes", "no"],
                values: []
              },
            ]
          },
          {
            id: 19,
            name: "Traitement par piqure à insuline ?",
            cond: {"yes":[16], "no":[17], num:[]},
            check : ["yes", "no"],
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
            values: []
          },
          {
            id: 24,
            name: "Consentement chirurgical de la mère",
            cond: {"yes":[], num:[{var:"age",op:"<",val:15}]},
            check: ["yes", "no"],
            values: []
          },
          {
            id: 25,
            name: "Consentement anestésique du père",
            cond: {"yes":[], num:[{var:"age",op:"<",val:15}]},
            check: ["yes", "no"],
            values: []
          },
          {
            id: 26,
            name: "Consentement anestésique de la mère",
            cond: {"yes":[], num:[{var:"age",op:"<",val:15}]},
            check: ["yes", "no"],
            values: []
          },
        ]
      },
      {
        id: 27,
        name: "Check Vernis à ongle",
        section_title : "Checks globaux pour anestésie",
        comment: "Ado/Adulte, nécessite vérification du vernis à ongle",
        cond: {"yes":[], num:[{var:"age",op:">",val:10}]},
        check: ["ok", "not_ok"],
        values: []
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
        pre_check: {if: [{var: "difficult_intubation", op: "est", val: "vrai"}], then: "yes"},
        values: []
      },
      {
        id: 2,
        name: "Test ? ",
        cond: {"yes": [], "no": [], num: []},
        check: ["yes", "no", "?"],
        values: []
      }
    ]
  }
];

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


export {checklist_list, patients}