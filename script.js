// https://pokeapi.co/api/v2/pokemon/pikachu
var app = new Vue({
    el: '#app',
    data: {
        previouspokemon: {
            name: '',
            id: '',
            image: '',
        },
        nextpokemon: {
            name: '',
            id: '',
            image: '',
        },
        pokemon: {
            name: '',
            id: '',
            image: '',
            color: '',
            category: '',
            evolution: [],
            flavor: '',
            flavorentries: [],
            height: '',
            weight: '',
            growth: '',
            shape: '',
            types: [],
            stats: {
              hp: {
                  name: 'HP',
                  stat: '',
              },
              atk: {
                  name: 'Attack',
                  stat: '',
              },
              def: {
                  name: 'Defense',
                  stat: '',
              },
              spatk: {
                  name: 'Special Attack',
                  stat: '',
              },
              spdef: {
                  name: 'Special Defense',
                  stat: '',
              },
              spd: {
                  name: 'Speed',
                  stat: '',
              },
            },
            generation: '',
            capturerate: '',
            basehappiness: '',
            abilities: [],
            helditems: [],
        },
        searchinput: '',
        search: '',
    },
    methods: {
        // fetchREST() {
        //   console.log("In Fetch " + this.prefix);
        //   var url = "http://pokeapi.co/api/v2/pokemon-species/" + "1"; //this.prefix;
        //   console.log("URL " + url);
        //   fetch(url)
        //     .then((data) => {
        //       return (data.json());
        //     })
        //     .then((citylist) => {
        //       console.log("CityList");
        //       console.log(citylist);
        //       this.cities = [];
        //       for (let i = 0; i < citylist.length; i++) {
        //         console.log(citylist[i].city);
        //         this.cities.push({ name: citylist[i].city });
        //       };
        //       console.log("Got Citylist");
        //     });
        // },
        async getfromapi() {

            try {
                var response = await axios.get("https://pokeapi.co/api/v2/pokemon/" + this.search);
                var speciesresponse = await axios.get("https://pokeapi.co/api/v2/pokemon-species/" + this.search);
                let data = response.data;
                let speciesdata = speciesresponse.data;
                console.log("/pokemon\n/pokemon-species");
                console.log(response.data);
                console.log(speciesresponse.data);

                this.pokemon.name = capitalizeFirstLetter(speciesdata.name);
                this.pokemon.id = data.id;
                this.pokemon.image = data.sprites.front_default;
                this.pokemon.color = speciesdata.color.name;
                for (i = 0; i < speciesdata.flavor_text_entries.length; i++) {
                    if (speciesdata.flavor_text_entries[i].language.name == "en") {
                        var flavorentry = (speciesdata.flavor_text_entries[i].flavor_text);
                        flavorentry = flavorentry.replace(/(\r\n|\n|\r|)/gm, " ");
                        this.pokemon.flavorentries.push(flavorentry);
                    }
                }
                this.pokemon.flavor = this.pokemon.flavorentries[this.pokemon.flavorentries.length - 1];
                this.pokemon.category = speciesdata.genera[2].genus;
                this.pokemon.types = [];
                if(data.types[0].slot == 1 ){
                    this.pokemon.types.push(capitalizeFirstLetter(data.types[0].type.name));
                    if(data.types.length>1){
                        this.pokemon.types.push(capitalizeFirstLetter(data.types[1].type.name));
                    }
                }
                else{
                    this.pokemon.types.push(capitalizeFirstLetter(data.types[1].type.name));
                    if(data.types.length>1){
                        this.pokemon.types.push(capitalizeFirstLetter(data.types[0].type.name));
                    }
                }
                
                this.pokemon.generation = speciesdata.generation.name;
                this.pokemon.capturerate = speciesdata.capture_rate;
                this.pokemon.basehappiness = speciesdata.base_happiness;
                this.pokemon.growth = speciesdata.growth_rate.name;
                this.pokemon.shape = capitalizeFirstLetter(speciesdata.shape.name);
                var ft=data.height*0.32808;
                if(ft>1){
                    var inch=((ft - Math.floor(ft))*12).toFixed(0);
                    this.pokemon.height = Math.floor(ft) + "' " + inch + '"';
                }
                else{
                    var inch=((ft - Math.floor(ft))*12).toFixed(1);
                    this.pokemon.height = inch + '"';
                }
                var lb=(data.weight*0.22046).toFixed(1);
                this.pokemon.weight = lb + " lbs";
                this.pokemon.stats.hp.stat = data.stats[5].base_stat;
                this.pokemon.stats.atk.stat = data.stats[1].base_stat;
                this.pokemon.stats.def.stat = data.stats[2].base_stat;
                this.pokemon.stats.spatk.stat = data.stats[3].base_stat;
                this.pokemon.stats.spdef.stat = data.stats[4].base_stat;
                this.pokemon.stats.spd.stat = data.stats[0].base_stat;
                
                this.pokemon.abilities = [];
                for(i=0; i<data.abilities.length; i++){
                    this.addAbility(data.abilities[i].ability.name, data.abilities[i].ability.url);
                }
                this.pokemon.helditems = [];
                for(i=0; i<data.held_items.length; i++){
                    this.addHeldItem(data.held_items[i].item.url);
                }
                // this.addEvolutions(speciesdata.evolution_chain.url);
                // this.addTypeMatchups(data.types);

                var previousid = this.pokemon.id - 1;
                var nextid = this.pokemon.id + 1;


                if (this.pokemon.id > 1) {
                    var previouspokemonresponse = await axios.get("https://pokeapi.co/api/v2/pokemon/" + previousid);
                    var previousdata = previouspokemonresponse.data;
                    this.previouspokemon.id = previousdata.id;
                    this.previouspokemon.name = capitalizeFirstLetter(previousdata.species.name);
                    this.previouspokemon.image = previousdata.sprites.front_default;
                }
                else {
                    this.previouspokemon.id = '';
                    this.previouspokemon.name = '';
                    this.previouspokemon.image = '';
                }
                if (this.pokemon.id < 802) {
                    var nextpokemonresponse = await axios.get("https://pokeapi.co/api/v2/pokemon/" + nextid);
                    var nextdata = nextpokemonresponse.data;
                    this.nextpokemon.id = nextdata.id;
                    this.nextpokemon.name = capitalizeFirstLetter(nextdata.species.name);
                    this.nextpokemon.image = nextdata.sprites.front_default;
                }
                else {
                    this.nextpokemon.id = '';
                    this.nextpokemon.name = '';
                    this.nextpokemon.image = '';
                }


                // if (data.types.length > 1){
                //     this.pokemon.type1 = data.types[1].type.name;
                //     this.pokemon.type2 = data.types[0].type.name;
                // }
                // else{
                //     this.pokemon.type1 = data.types[0].type.name;
                // }

            }
            catch (error) {
                console.log(error);
                this.number = this.max;
            }
        },
        async addAbility(name, url) {
            var abilityname = capitalizeFirstLetter(name);
            var abilityurl = url;
            var abilityresponse = await axios.get(abilityurl);
            // console.log(abilityresponse);
            var abilitydata = abilityresponse.data;
            
            // console.log("ability data: ");
            // console.log(abilitydata);
                this.pokemon.abilities.push({
                name: abilitydata.names[2].name,
                description: abilitydata.effect_entries[0].effect,
            });
        },
        async addHeldItem(url){
            var helditemresponse = await axios.get(url);
            var helditemdata = helditemresponse.data;
            // console.log(helditemdata);
            this.pokemon.helditems.push({
               name: helditemdata.names[2].name,
               description: helditemdata.flavor_text_entries[2].text,
               image: helditemdata.sprites.default,
            });
        },
        // async addEvolutions(url){
        //     var evoresponse = await axios.get(url);
        //     var evodata = evoresponse.data;
        //     console.log(evodata);
        //     this.pokemon.evolution.push({name:evodata.chain.species.name,url:evodata.chain.species.url});
        // },
        // async addTypeMatchups(typesdata){
        //   var typeurls = [];
        //   for(i=0;i<typesdata.length;i++){
        //       typeurls.push(typesdata[i].type.url);
        //   }
        //   var dmgrel;
        //   var off2 = [];
        //   var offhalf = [];
        //   var off0 = [];
        //   var def2 = [];
        //   var defhalf = [];
        //   var def0 = [];
        //   for(j=0;j<typeurls.length;j++){
        //   await addTypeMatch(typeurls[j]);
        //   var help = dmgrel;
        //   console.log(help);
        //   for(i=0;i<dmgrel.double_damage_from.length;i++){
        //       def2.push(dmgrel.double_damage_from[i].name);
        //   }
        //   for(i=0;i<dmgrel.half_damage_from.length;i++){
        //       defhalf.push(dmgrel.half_damage_from[i].name);
        //   }
        //   for(i=0;i<dmgrel.no_damage_from.length;i++){
        //       def0.push(dmgrel.no_damage_from[i].name);
        //   }
        //   console.log(def2);
        //   console.log(defhalf);
        //   console.log(def0);
        //   }
        //   var fullmatchuparray = [];
        //   var fullmatchupmults = [];
        //   for(i=0;i<dmgrel.double_damage_from.length;i++){
        //     var typename = dmgrel.double_damage_from[i].name;
        //     if(arraycontains(typename)){
        //         var index = findinarray(typename);
        //         fullmatchupmults[index] *= 2;
        //     }
        //     else{
        //         fullmatchuparray.push(typename);
        //         fullmatchupmults.push(2);
        //     }
        //   }
        //     for(i=0;i<dmgrel.half_damage_from.length;i++){
        //     var typename = dmgrel.half_damage_from[i].name;
        //     if(arraycontains(typename)){
        //         var index = findinarray(typename);
        //         fullmatchupmults[index] *= 0.5;
        //     }
        //     else{
        //         fullmatchuparray.push(typename);
        //         fullmatchupmults.push(0.5);
        //     }
        //   }
        //   for(i=0;i<dmgrel.no_damage_from.length;i++){
        //     var typename = dmgrel.no_damage_from[i].name;
        //     if(arraycontains(typename)){
        //         var index = findinarray(typename);
        //         fullmatchupmults[index] *= 0;
        //     }
        //     else{
        //         fullmatchuparray.push(typename);
        //         fullmatchupmults.push(0);
        //     }
        //   }
        //   console.log(fullmatchuparray);
        //   console.log(fullmatchupmults);
          
          
        //   function arraycontains(name){
        //       console.log("ARRAYCONTAINS")
              
        //       for(j=0;j<fullmatchuparray.length;j++){
        //           console.log(fullmatchuparray);
        //           console.log(fullmatchuparray[j] + " ??? " + name);
        //           if(fullmatchuparray[j] == name){
                      
        //               console.log("array contains" + fullmatchuparray[j])
        //               return true;
        //           }
        //       }
        //       return false;
        //   }
        //   function findinarray(name){
        //       console.log("FINDINARRAY")
        //     for(j=0;j<fullmatchuparray.length;j++){
        //           if(fullmatchuparray[j] == name){
        //                 return j;
        //           }
        //       }
        //   }
        //   async function addTypeMatch(url){
        //       var tmatchres = await axios.get(url);
        //       var tmatchdata = tmatchres.data;
        //       console.log(tmatchdata);
        //       dmgrel = tmatchdata.damage_relations;
        //   }  
        // },
        getPokemon() {
            this.search = this.searchinput.toLowerCase();
            this.getfromapi();
        },
        getRandomPokemon() {
            var min = 1;
            var max = 721; //Random will only show up to and including generation 6 because the sprites after that point don't bring me joy.
            this.search = Math.floor((Math.random() * (max - min + 1) + min));
            this.getfromapi();
        },
        getpreviouspokemon() {
            this.search = this.previouspokemon.id;
            this.getfromapi();
        },
        getnextpokemon() {
            this.search = this.nextpokemon.id;
            this.getfromapi();
        }

    },
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// app.getRandomPokemon();