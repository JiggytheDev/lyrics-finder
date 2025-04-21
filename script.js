const search = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-search-icon');
const result = document.querySelector('.js-result');
//Api URL
const apiURL = `https://genius-song-lyrics1.p.rapidapi.com/search/?q=`
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '03e776fdd6msh8a86196d8443ddbp142295jsna4c1f2e10666',
		'x-rapidapi-host': 'genius-song-lyrics1.p.rapidapi.com'
	}
};
const placeholder = document.get 
// Clear and show default placeholder when typing
function clearResults() {
    result.innerHTML = `
        <img src="image/490989071_1086558596846762_1766860759656454543_n.jpg" alt="" width="200px" height="200px">
        <h1>Search for lyrics and they'll appear here</h1>
    `;
}
let searchValue = search.value.trim();


//Handle Search icon click
searchBtn.addEventListener('click', () =>{
    searchValue = search.value.trim();
    if(!searchValue) {
        alert('Please enter something to search!');
        return;
    }
    searchSong(searchValue);
});

// For the Keydown Event
search.addEventListener('keydown', (event) => {
    searchValue = search.value.trim();
    if (event.key === 'Enter') {
        
        searchSong(searchValue);
    };
});

// Search Genius API
async function searchSong(searchValue) {
    result.innerHTML= `
    <p>Loading... Please wait</p>
    `;
    try{
        const res = await fetch(`${apiURL}${encodeURIComponent(searchValue)}`, options);
        const data = await res.json();
        displayResult(data);
    }catch (err){
        result.innerHTML = `<p>Error fetching song info.</p>`;
    }
}
// Display results
function displayResult(data) {
    const hits = data?.hits ||data?.sections?.[0]?.hits || [];

    if (hits.length === 0) {
        result.innerHTML = `<p>No results found</p>`;
        return;
    }

    result.innerHTML = `
        <ul class="song-list">${hits.map((hit, index) => `
            <li data-index="${index}" data-artist="${hit.result.primary_artist.name}" data-title="${hit.result.title}">
                <div>
                    <img src="${hit.result.song_art_image_thumbnail_url}" ait="${hit.result.title}"/>
                    <p><strong>${hit.result.title}</strong>
                 by ${hit.result.primary_artist.name}</p>
                 </div>
                   
                   <button>View Lyrics</button>
            </li>
            `).join('')}
        </ul>
    `;

    //Attaching click event to each 'view lyrics' buttn
    document.querySelectorAll('.song-list li button').forEach(button => {
        button.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            const artist = li.dataset.artist;
            const title =  li.dataset.title;
            fetchLyrics(artist, title);
        });
    });
}


// fetching lyrics from Lyrics.ovh
async function  fetchLyrics(artist, title) {
    result.innerHTML = `<p>Fetching Lyrics for "${title}" by ${artist}...</p>`;
    try{
        const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
        const data = await res.json();

        if (data.lyrics) {
            result.innerHTML=`
            <h3>Lyrics for "${title}" by ${artist}</h3>
            <pre style="white-space: pre-wrap;">${data.lyrics}</pre>
            <button onclick="clearResults()">Back to Search</button>
            `;
        }else{
            result.innerHTML= '<p>Lyrics not found.</p>';
        }
    }  catch (error) {
        result.innerHTML= '<p>Error fetching lyrics.</p>';
    }
}