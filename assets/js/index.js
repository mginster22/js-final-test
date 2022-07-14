"use strict";
const linkPath = new Map();
linkPath.set("www.facebook.com", "fa-facebook");
linkPath.set("twitter.com", "fa-twitter");
linkPath.set("www.instagram.com", "fa-instagram");

const massiveActors = [];

fetch("./assets/js/data.json")
  .then((resolve) => resolve.json())
  .then((data) => {
    const HTMLColection = data
      .filter((actor) => actor.firstName || actor.lastName)
      .map((data) => createActor(data));
    actorsBlock.append(...HTMLColection);
  })
  .catch(() => {
    const errorText = createElement(
      "h2",
      { classNames: ["error-text"] },
      document.createTextNode("sorry we're having connection problems")
    );
    const error = createElement("div", { classNames: ["error"] }, errorText);
    const errorOpacity = createElement("div", {
      classNames: ["error-opacity"],
    });
    document.body.append(errorOpacity,error);
  });
function createActor({ id, firstName, lastName, profilePicture, contacts }) {
  const actorSocialColection = contacts.map((item) => {
    const actorSocial = new URL(item).hostname;
    return createElement(
      "div",
      { classNames: ["actor-social"] },
      createElement("a", {
        classNames: ["social", "fa-brands", linkPath.get(actorSocial)],
        attributes: { href: item, target: "_blank" },
      })
    );
  });
  const actorSocials = createElement(
    "div",
    { classNames: ["actor-socials"] },
    ...actorSocialColection
  );

  const actorFullName = createElement(
    "h2",
    { classNames: ["actor-fullname"] },
    document.createTextNode(`${firstName} ${lastName}`)
  );

  const initials = createElement(
    "div",
    {
      classNames: ["initials"],
      styles: {
        backgroundColor: stringToColour(
          `${firstName} ${lastName}`.trim() || "Anonim"
        ),
      },
    },
    document.createTextNode(
      createInitials(`${firstName} ${lastName}`) || "Anonim"
    )
  );
  const avatar = createElement("img", {
    classNames: ["avatar"],
    attributes: {
      src: profilePicture,
      alt: `${firstName} ${lastName}`,
      "data-wrapper-id": `avatar-block-circle-${id}`,
    },
    events: { error: handlerErrorAvatar, load: handlerLoadAvatar },
  });

  const avatarBlockCircle = createElement(
    "div",
    {
      classNames: ["avatar-block-circle"],
      attributes: {
        id: `avatar-block-circle-${id}`,
      },
    },
    initials
  );

  const avatarActorBlock = createElement(
    "div",
    { classNames: ["avatar-actor-block"] },
    avatarBlockCircle
  );

  const actor = createElement(
    "article",
    { classNames: ["actor"] },
    avatarActorBlock,
    actorFullName,
    actorSocials
  );
  return actor;
}

const actorsChoosedText = createElement(
  "p",
  { classNames: ["actors-choosed-text"] },
  document.createTextNode("you choosed")
);
const actorsChoosed = createElement(
  "div",
  { classNames: ["actors-choosed"] },
  actorsChoosedText
);

const actorsBlock = createElement("div", {
  classNames: ["actors-block"],
  events: { click: actorHandler },
});

const actorsHeading = createElement(
  "h1",
  { classNames: ["heading"] },
  document.createTextNode("actors")
);
const actorsWrapper = createElement(
  "div",
  { classNames: ["actors-wrapper"] },
  actorsHeading,
  actorsBlock,
  actorsChoosed
);
const container = createElement(
  "div",
  { classNames: ["container"] },
  actorsWrapper
);
const actorsSection = createElement(
  "section",
  { classNames: ["actors-section"] },
  container
);
document.body.append(actorsSection);

function actorHandler({ target }) {
  const actorList = target.querySelector(".actor-fullname ");
  if (!actorList) {
    return;
  }
  const actorName = actorList.textContent;
  if (!massiveActors.includes(actorName)) {
    actorsChoosedText.style.display = "none";

    massiveActors.push(actorName);
    const actorItem = createElement(
      "li",
      { classNames: ["actor-item"] },
      document.createTextNode(actorName)
    );
    actorsChoosed.append(actorItem);
  }
}

function handlerErrorAvatar({ target }) {
  target.remove();
}
function handlerLoadAvatar({ target }) {
  document.getElementById(target.dataset.wrapperId).append(target);
}

function createElement(
  tag,
  { classNames = [], styles = {}, attributes = {}, events = {} },
  ...children
) {
  const element = document.createElement(tag);

  if (classNames.length) {
    element.classList.add(...classNames);
  }

  for (const [nameStyle, valueStyle] of Object.entries(styles)) {
    element.style[nameStyle] = valueStyle;
  }

  for (const [nameAttr, valueAttr] of Object.entries(attributes)) {
    element.setAttribute(nameAttr, valueAttr);
  }

  for (const [typeEvent, handlerEvent] of Object.entries(events)) {
    element.addEventListener(typeEvent, handlerEvent);
  }

  element.append(...children);

  return element;
}
function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).slice(-2);
  }
  return colour;
}
function createInitials(str) {
  return str
    .split(" ")
    .map((elem) => elem.slice(0, 1).toUpperCase())
    .join("");
}
