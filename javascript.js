let btn =document.getElementById('btn')
let output= document.getElementById ('output')
var Quotes=[
    "The unexamined life is not worth living -Socrates",
    "One cannot step twice in the same river -Heraclitus",
    "The greatest happiness of the greatest number is the foundation of morals and legislation - Jeremy Bentham",
    "Happiness is not an ideal of reason but of imagination - Immanuel Kant",
    "No man\'s knowledge here can go beyond his experience - John Locke",
    "God is not willing to do everything, and thus take away our free will and that share of glory which belongs to us -Niccolo Machiavelli",
    "Liberty consists in doing what one desires - John Stuart Mill",
];

btn.addEventListener('click',function newQuote(){
    var randomNumber=Quotes[ Math.floor(Math.random()*(Quotes.length))]
    output.innerHTML=randomNumber;
})