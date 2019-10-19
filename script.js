// https://pokeapi.co/api/v2/pokemon/pikachu
var myvar;

let app = new Vue({
  el: '#app',
  data: {
    loading: true,
    addedName: '',
    addedComment: '',
    comments: {},
    ratings: {
    },
    number: '',
    max: '',
    current: {
      title: '',
      img: '',
      alt: ''
    },
    loading: true,
  },
  created() {
    this.pokemon();
  },
  methods: {
    
    async pokemon() {
        console.log("called pokemon()");
      try {
        this.loading = true;
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/' + this.number);
        this.current = response.data;
        console.log(this.current);
        myvar = this.current;
        this.loading = false;
        this.number = response.data.num;
        console.log(response.data.forms);
        this.myavg = '';

      } catch (error) {
        console.log("Error. Setting number to max.")
        this.number = this.max;
      }
    },
    firstComic() {
      this.number = 1;
    },
    previousComic() {
      this.number = this.current.num - 1;
      if (this.number < 1)
        this.number = 1;
    },
    nextComic() {
      this.number = this.current.num + 1;
      if (this.number > this.max)
        this.number = this.max
    },
    lastComic() {
      this.number = this.max;
    },
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },
    randomComic() {
      this.number = this.getRandom(1, this.max);
    },
    setRating(rating){
            if (!(this.number in this.ratings))
        Vue.set(this.ratings, this.number, {
          sum: 0,
          total: 0,
        });
      this.ratings[this.number].sum += rating;
      this.ratings[this.number].total += 1;
    },
    addComment() {
      if (!(this.number in this.comments))
        Vue.set(app.comments, this.number, new Array);
      this.comments[this.number].push({
        author: this.addedName,
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        text: this.addedComment,
        
      });
      this.addedName = '';
      this.addedComment = '';
    },
  },
   computed: {
    theavgrating(){
      if (this.current === undefined)
      return '';
      if (this.ratings[this.number] === undefined)
      return '';
      // var rating = "";
      return (this.ratings[this.number].sum / this.ratings[this.number].total).toFixed(1);
    },
    month() {
      var month = new Array;
      if (this.current.month === undefined)
        return '';
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      return month[this.current.month - 1];
    }
  },
  watch: {
    number(value, oldvalue) {
      if (oldvalue === '') {
        this.max = value;
      } else {
        this.pokemon();
      }
    },
  },
});