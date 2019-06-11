if (document.getElementById('senate')) {
  var dataSH = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else {
  var dataSH = "https://api.propublica.org/congress/v1/113/house/members.json";
};

var app = new Vue({
  el: '#app',
  data: {
    "members": [],
    "aux_members": [],
    "democrats": [],
    "republicans": [],
    "independents": [],
    "arrayOrdenado": [],
    "arrayOrdenadoLoyal": [],
    "miembrosEngaged": [],
    "miembrosLoyal": [],
    "number_of_democrats": 0,
    "number_of_republicans": 0,
    "number_of_independents": 0,
    "total": 0,
    "democrats_average_votes_with_party": 0,
    "republicans_average_votes_with_party": 0,
    "independents_average_votes_with_party": 0,
    "total_average": 0,
    "least_engaged": [],
    "most_engaged": [],
    "least_loyal": [],
    "most_loyal": []
  },
  methods: {
    goFetch: function () {
      fetch(dataSH, {
        method: 'GET',
        headers: new Headers({
          "X-API-Key": "cjltSelGSVnCNFzwvEdQ8uKJ7FYecq1zeimHb3J7"
        })
      }).then(function (response) {
        if (response.ok) {
          // add a new promise to the chain
          return response.json();
        }
        // signal a server error to the chain
        throw new Error(response.statusText);
      }).then(function (json) {
        app.members = json.results[0].members;
        app.aux_members = json.results[0].members;
        // console.log(app.members)
        app.democrats = app.members.filter(element => element.party === "D");
        app.republicans = app.members.filter(element => element.party === "R");
        app.independents = app.members.filter(element => element.party === "I");
        app.number_of_democrats = app.democrats.length;
        app.number_of_republicans = app.republicans.length;
        app.number_of_independents = app.independents.length;
        app.total = app.members.length;
        app.democrats_average_votes_with_party = app.sumarVotes(app.votesWP(app.democrats)).toFixed(2);
        app.independents_average_votes_with_party = app.sumarVotes(app.votesWP(app.independents)).toFixed(2);
        app.republicans_average_votes_with_party = app.sumarVotes(app.votesWP(app.republicans)).toFixed(2);
        app.total_average = (app.sumarVotes(app.votesWP(app.members))).toFixed(2);
        app.arrayOrdenado = app.members.sort(function (a, b) {
          return a.missed_votes_pct - b.missed_votes_pct
        });
        app.completarEngaged(app.members);
        app.engaged(app.miembrosEngaged);
        app.arrayOrdenadoLoyal = app.members.sort(function (a, b) {
          return a.votes_with_party_pct - b.votes_with_party_pct
        });
        app.completarLoyal(app.members);
        app.loyal(app.miembrosEngaged);
      })
    },
    votesWP: function (array) {
      let allVotes = []
      for (let i = 0; i < array.length; i++) {
        allVotes.push(array[i].votes_with_party_pct)
      }
      return allVotes
    },
    sumarVotes: function (array) {
      let suma = 0;
      let total = 0;
      if (array.length) {
        for (let i = 0; i < array.length; i++) {
          suma = suma + array[i]
        }

        total = suma / array.length;
      }

      return total;
    },
    miFiltro: function () {
      let valoresTildados = document.querySelectorAll("input[name=party-filter]:checked");
      let selected = document.querySelector('#select-states').value;
      console.log(selected);
      valoresTildados = Array.from(valoresTildados);
      valoresTildados = valoresTildados.map(function (input) {
        return input.value
      });
      listaFiltrada = []

      if (selected !== 'All') {
        for (let i = 0; i < app.members.length; i++) {

          if (valoresTildados.includes(app.aux_members[i].party) && app.aux_members[i].state === selected) {
            listaFiltrada.push(app.aux_members[i])
          }
        }
      } else {
        for (let i = 0; i < app.aux_members.length; i++) {

          if (valoresTildados.includes(app.aux_members[i].party)) {
            listaFiltrada.push(app.aux_members[i])
          }

        }
      }
      app.members = listaFiltrada
    },
    completarEngaged: function (array) {
      for (let index = 0; index < array.length; index++) {
        var objetoMiembrosEngaged = {};
        if (app.members[index].middle_name === null) {
          objetoMiembrosEngaged['name'] = app.members[index].last_name + ', ' + app.members[index].first_name
        } else {
          objetoMiembrosEngaged['name'] = app.members[index].last_name + ', ' + app.members[index].first_name + ' ' + app.members[index].middle_name;
        }
        objetoMiembrosEngaged['url'] = app.members[index].url;
        objetoMiembrosEngaged['missed'] = app.members[index].missed_votes;
        objetoMiembrosEngaged['percentage'] = app.members[index].missed_votes_pct;
        app.miembrosEngaged.push(objetoMiembrosEngaged)
        console.log('miembro engaged:' + app.miembrosEngaged[index])
      }
      console.log('los miembros engaged son: ' + app.miembrosEngaged)
    },
    engaged: function () {
      let elDiez;
      let i = 0;

      while (Number.isInteger(elDiez) == false) {
        elDiez = ((app.members.length + i) * 10) / 100;
        i++;
        for (let index = 0; index < elDiez; index++) {

          app.most_engaged.push(app.miembrosEngaged[index])

        }
        for (let index = (app.miembrosEngaged.length - elDiez); index < app.miembrosEngaged.length; index++) {

          app.least_engaged.push(app.miembrosEngaged[index])

        }
      }
    },
    completarLoyal: function (array) {
      for (let index = 0; index < array.length; index++) {
        var objetoMiembrosLoyal = {};
        if (app.members[index].middle_name === null) {
          objetoMiembrosLoyal['name'] = app.members[index].last_name + ', ' + app.members[index].first_name
        } else {
          objetoMiembrosLoyal['name'] = app.members[index].last_name + ', ' + app.members[index].first_name + ' ' + app.members[index].middle_name;
        }
        objetoMiembrosLoyal['url'] = app.members[index].url;
        objetoMiembrosLoyal['partyVotes'] = ((app.members[index].total_votes * app.members[index].votes_with_party_pct) / 100).toFixed(0);
        objetoMiembrosLoyal['percentagePV'] = app.members[index].votes_with_party_pct;
        app.miembrosLoyal.push(objetoMiembrosLoyal)
        console.log('miembro Loyal:' + app.miembrosLoyal[index])
      }
      console.log('los miembros Loyal son: ' + app.miembrosLoyal)
    },
    loyal: function () {
      let elDiez;
      let i = 0;

      while (Number.isInteger(elDiez) == false) {
        elDiez = ((app.members.length + i) * 10) / 100;
        i++;
        for (let index = 0; index < elDiez; index++) {

          app.least_loyal.push(app.miembrosLoyal[index])

        }
        for (let index = (app.miembrosLoyal.length - elDiez); index < app.miembrosLoyal.length; index++) {

          app.most_loyal.push(app.miembrosLoyal[index])

        }
      }
    }
  }
})
app.goFetch();

// FALTA ORENAR LOS LOYAL!!! y sacar null del nombre