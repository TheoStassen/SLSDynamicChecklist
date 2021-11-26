/* Data that will be obtain by call to backend
* */

/*Initial checklist list*/
const checklist_list = [
  {
    checklist_id: 0,
    id: -1,
    num_values:[
      {var:"difficult_intubation", val:1},
      {var:"diabetic", val:1},
    ],
    values:[
      {
        id: 1,
        name: "Intubation Difficile ? ",
        cond: {"yes":[], "no":[], num:[]},
        check : ["yes","no","idk"],
        pre_check : {if:[{var:"difficult_intubation",op:"=",val:1}],then:"yes"},
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
        comment: "(Les données patient nous indiquent que la patiente est âgée entre 15 et 60 ans)",
        cond: {"yes":[], "no":[], num:[{var:"yearofbirth",op:">",val:1960}, {var:"gender",op:"=",val:"F"}]},
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
        cond: {"yes":[], "no":[], num:[]},
        check : ["yes","no"],
        pre_check : {if:[{var:"diabetic",op:"=",val:1}],then:"yes"},
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
              }
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
        ]
      }
    ]
  },
  {
    checklist_id: 1,
    id: -1,
    num_values:[
      {var:"Intubation_difficile", val:1},
      {var:"Diabétique", val:1},
    ],
    values:[
      {
        id: 1,
        name: "Intubation ? ",
        cond: {"yes": [], "no": [], num: []},
        check: ["yes", "no", "?"],
        pre_check: {if: [{var: "Intubation_difficile", op: "=", val: 1}], then: "yes"},
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
  {id: 0, name: "Jean Dupont", gender: "M", yearofbirth: 1970},
  {id: 1, name: "Robert Edwards", gender: "M", yearofbirth: 1998},
  {id: 2, name: "Luc Monjeau", gender: "M", yearofbirth: 1965},
  {id: 3, name: "Eglantine Racine", gender: "F", yearofbirth: 1987},
  {id: 4, name: "Georgette Cailot", gender: "F", yearofbirth: 1941}
]


export {checklist_list, patients}