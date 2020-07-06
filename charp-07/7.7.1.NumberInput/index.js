
var app = new Vue({
    el: '#app',
    data: {
        value: 0
    },
    methods: {
        onValueChange: function () {
            console.log('onValueChange->', this.value);
        }
    }
});