var bandBtn = document.querySelector("#band-btn")

var bandSearch = function(bandName) {
    console.log(bandName);
    
   var apiKey = "app_id=e3abf6a96b165072b89208b2a7146862";
    fetch(
        'https://rest.bandsintown.com/artists/' + bandName + '/?' + apiKey)
    .then(function (response) {
        console.log(response)
        return response.json();
        
    })
    .then(function (ArtistData) {
        console.log(ArtistData);
        displayBandInfo(ArtistData);
    })

}

var displayBandInfo = function(ArtistData) {
var picture = document.querySelector("#image")
var bandText = document.querySelector(".band-text")
var bitInfo = document.querySelector("#info-link")
//console.log(bandText);
bandText.textContent = ArtistData.name;
picture.setAttribute('src', ArtistData.thumb_url);
bitInfo.setAttribute('href', ArtistData.url)
}

var clutchInfo = function() {
    document.getElementById("info-link").innerHTML = "Clutch is an American rock band from Frederick, Maryland, United States. Since its formation in 1991, the band line-up has included Tim Sult (lead guitar), Dan Maines (bass), Jean-Paul Gaster (drums), and Neil Fallon (vocals, rhythm guitar, keyboards). To date, Clutch has released twelve studio albums, and several rarities and live albums. Since 2008, the band have been signed to their own record label, Weathermaker.";
    

}

var keysInfo = function() {
    document.getElementById("info-link").innerHTML = "The Black Keys are an American rock band formed in Akron, Ohio, in 2001. The group consists of Dan Auerbach (guitar, vocals) and Patrick Carney (drums). The duo began as an independent act, recording music in basements and self-producing their records, before they eventually emerged as one of the most popular garage rock artists during a second wave of the genre's revival in the 2010s. The band's raw blues rock sound draws heavily from Auerbach's blues influences, including Junior Kimbrough, Howlin' Wolf, and Robert Johnson.";
   }

var woodInfo = function() {
    document.getElementById("info-link").innerHTML = "The Wood Brothers are an American folk band consisting of brothers Chris (upright bass) and Oliver Wood (acoustic and electric guitars), as well as multi-instrumentalist Jano Rix.";
    }

var strutsInfo = function() {
    document.getElementById("info-link").innerHTML = "The Struts are an English rock band from Derby, Derbyshire, England. The band consists of vocalist Luke Spiller, guitarist Adam Slack, bassist Jed Elliot, and drummer Gethin Davies. Formed in 2012, the original lineup was composed of Spiller, Slack, bassist Jamie Binns and drummer Rafe Thomas.";
   }

var bluesTravelerInfo = function() {
    document.getElementById("info-link").innerHTML = "Blues Traveler is an American rock band that formed in Princeton, New Jersey in 1987. The band's music spans a variety of genres, including blues rock, psychedelic rock, folk rock, soul, and Southern rock. They are known for extensive use of segues in live performances, and were considered a key part of the re-emerging jam band scene of the 1990s, spearheading the H.O.R.D.E. touring music festival.";
    }

var rivalSonsInfo = function() {
    document.getElementById("info-link").innerHTML = "Rival Sons are an American rock band formed in Long Beach, California in 2009. The group consists of lead vocalist Jay Buchanan, guitarist Scott Holiday, bassist Dave Beste and drummer Michael Miley. The band is also joined by touring keyboard player Todd Ögren when on the road. They are signed to Atlantic Records via Dave Cobb's label Low Country Sound, an imprint of Elektra. They have released six albums and one EP.";
    }

var guyInfo = function() {
    document.getElementById("info-link").innerHTML = "Mike Silverman, better known as That 1 Guy, is an American musician based in Las Vegas, Nevada. He frequently performs and records as a one-man band, singing and using a variety of homemade musical instruments.";
    }

var kellerInfo = function() {
    document.getElementById("info-link").innerHTML = "Keller Williams is an American singer, songwriter and musician who combines elements of bluegrass, folk, alternative rock, reggae, electronica/dance, jazz, funk, along with other assorted genres. He is often described as a 'one-man jam-band' due to his frequent use of live phrase looping with multiple instruments. Keller Williams was born in Fredricksburg, Virginia on February 4, 1970 and began playing the guitar in his early teens. He later matriculated to Virginia Wesleyan College in Virginia Beach where he received his degree in theater. After college, he moved to Colorado to advance his music career and expand his repertoire.";
   }

var willInfo = function() {
    document.getElementById("info-link").innerHTML = "William Elliott Whitmore (born May 11, 1978) is an American blues, country, folk singer and musician. He plays roots-folk music that is often inspired by his life on his family farm in the hills of southeastern Iowa.";
    }

var dirtyHoneyInfo = function() {
    document.getElementById("info-link").innerHTML = "Dirty Honey is an American rock band from Los Angeles, formed in 2017. It consists of singer Marc Labelle, guitarist John Notto, bassist Justin Smolian, and drummer Corey Coverstone. Their self-titled extended play was self-released in March 2019. The single 'When I'm Gone' topped the Billboard Mainstream Rock Songs chart, making them the first unsigned band to ever top the chart. Dirty Honey is an iHeartRadio On The Verge Artist.";
   }

var searchBtn = document.querySelectorAll(".band-button")
searchBtn.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        var bandName = event.target.value
        bandSearch(bandName)
      console.log(event.target.value);
    });
  });