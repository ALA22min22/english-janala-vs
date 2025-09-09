const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((btn) => btn.classList.remove("active"));
};

const createElement = (arr) => {
    const store = arr.map(data =>  ` <span class="btn btn-soft btn-primary">${data}</span> `);
    return (store.join(" "));
}

const controlSpinner = (status) => {
  if(status == true){   //true er khetre
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('word-container').classList.add('hidden');
  }
  else{          //false er khetre
    document.getElementById('word-container').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  }
}


// lesson add

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => {
      displayLessons(json.data);
    });
};


const loadLevelWord = (id) => {

  controlSpinner(true)

  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

const modal = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayModal(details.data);
};



const displayModal = (word) => {
  // console.log(word);
  const parent = document.getElementById("details-container");
  parent.innerHTML = `
  <div>
            <h2 class="text-2xl font-bold">${word.word} ( <i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
          </div>
          <div>
            <h2 class="text-xl font-medium">meaning</h2>
            <p class="font-bangla">${word.meaning}</p>
          </div>
          <div>
            <h2 class="text-xl font-medium">example</h2>
            <p class="font-bangla">${word.sentence}</p>
          </div>
          <div>
            <p class="font-bangla text-xl">synonyms</p>
              <div>${createElement(word.synonyms)}</div>
            </div>
            `;
            // <span class="btn btn-soft btn-primary">keen</span>
  document.getElementById("my_modal_5").showModal();
};

const displayLevelWord = (words) => {
  const parent = document.getElementById("word-container");
  parent.innerHTML = "";

  if (words.length == 0) {
    parent.innerHTML = ` <div class="text-center col-span-full space-y-3">
    <img src="./assets/alert-error.png" alt="" class="mx-auto"> 
    <p class="text-sm font-bangla text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
    <h2 class="text-[33px] font-bangla font-medium">নেক্সট Lesson এ যান</h2>
    </div> `;
    controlSpinner(false);
    return;
  }

  for (const word of words) {
    const div = document.createElement("div");
    div.innerHTML = ` 
    <div class=" bg-white pt-15 px-5 rounded-lg shadow-sm text-center space-y-4">
    <h2 class="text-2xl font-bold">${
      word.word ? word.word : "word-not founded"
    } </h2>
    <p class="my-2">Meaning / Pronounciation</p>
    <div class="font-bangla text-[22px] font-semibold">${
      word.meaning ? word.meaning : "meaning not founded"
    } / ${
      word.pronunciation ? word.pronunciation : "pronunciation not founded"
    }</div>
    <div class="flex justify-between items-center pb-3">
    <button onclick="modal(${
      word.id
    })" class="py-1.5 px-2 bg-[#1A91FF10] rounded-lg hover:bg-[#1A91FF80] "><i class="fa-solid fa-circle-info"></i></button>
    <button onclick=" pronounceWord('${word.word}') " 
    class="py-1.5 px-2 bg-[#1A91FF10] rounded-lg hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
    </div>
         </div>
        `;
    parent.appendChild(div);
  }
  controlSpinner(false);
};

const displayLessons = (lessons) => {
  const parent = document.getElementById("label-container");
  parent.innerHTML = "";

  lessons.forEach((lesson) => {
    const div = document.createElement("div");
    div.innerHTML = ` 
        <button id="lesson-btn-${lesson.level_no}"
         onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-brands fa-leanpub"></i>Lesson ${lesson.level_no}
        </button>
        `;
    parent.appendChild(div);
  });
};

loadLessons();

// search button
document.getElementById('mr-btn').addEventListener('click', () => {
  removeActive()
    const search =  document.getElementById('mr-input')
    const value = search.value.trim().toLowerCase();
    console.log(value);

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
      const allWord = data.data;
      const filterWords = allWord.filter(word => word.word.toLowerCase().includes(value) );
      
      displayLevelWord(filterWords);  //display kortese
    });
})

// sound / speaker
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}