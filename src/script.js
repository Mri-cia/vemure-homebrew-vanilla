import $ from "https://cdn.jsdelivr.net/npm/jquery@3.7.1/+esm";

async function getJsonData(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('Tidak dapat mengambil.');
    return response.json();
}

function createSkillCard(skill) {
  const wrap = document.createElement("div");
  wrap.className = "card-wrap";

  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("span");
  title.className = "title";

  const name = document.createElement("span");
  name.textContent = skill.skill_name;

  const meta = document.createElement("span");
  meta.textContent = ` (${skill.attribute}/${skill.difficulty})`;

  title.append(name, meta);

  const notes = document.createElement("p");
  notes.className = "hidden-content";

  const label = document.createElement("i");
  label.textContent = "Notes: ";

  notes.append(label, skill.notes);

  card.append(title, notes);
  wrap.append(card);
  return wrap;
}

function createTraitCard(trait) {
  const wrap = document.createElement("div");
  wrap.className = "card-wrap";
  wrap.dataset.category = trait.category;

  const card = document.createElement("div");
  card.className = "card";

  const heading = document.createElement("h4");

  const name = document.createElement("span");
  name.textContent = trait.trait_name;
  heading.append(name);

  if (trait.cost !== undefined) {
    const cost = document.createElement("span");
    cost.textContent = ` (${trait.cost})`;
    heading.append(cost);
  }

  const type = document.createElement("span");
  type.innerHTML = trait.type.italics();
  heading.append(document.createElement("br"), type);

  const notes = document.createElement("p");
  notes.className = "hidden-content";

  const label = document.createElement("i");
  label.textContent = "Notes: ";
  notes.append(label, trait.notes);

  card.append(heading, notes);
  wrap.append(card);
  return wrap;
}

async function printSkills(){
    const skillsElm = document.getElementById('skill-list');
    skillsElm.replaceChildren();


    try {
        const skills = await getJsonData("/static/gurps_skills.json");
        skillsElm.append(...skills.map(createSkillCard))
    } catch (err) {
        console.error(err);
    }
}

function filterTraits(trait){
    const currentActive = document.querySelector('#active')?.getAttribute("data-filter")
    console.log(currentActive)
    return trait.category === currentActive;
}


async function printTraits(){
    const elm = document.getElementById('trait-list');
    elm.replaceChildren();


    try {
        const traits = await getJsonData("/static/gurps_traits.json");
        const filteredTraits = traits.filter(trait => filterTraits(trait))
        elm.append(...filteredTraits.map(createTraitCard))
    } catch (err) {
        console.error(err);
    }
}



function changeTraitFilter(){ 

    $('.trait-filter').click(function(){

        if($('#active').attr('data-filter') !== $(this).attr('data-filter')){
            $('#active').removeAttr('id')
            $(this).attr('id', 'active')
            printTraits()
        }

    })
    
}

function showHidden(){
    $('hidden-content').hide()
    $('card').hover(function(){
        $('hidden-content').show()
    })
}


printSkills()
printTraits()
changeTraitFilter()
showHidden()