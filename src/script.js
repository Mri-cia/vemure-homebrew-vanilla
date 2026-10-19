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

printSkills()