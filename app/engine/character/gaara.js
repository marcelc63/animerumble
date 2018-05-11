let constructor = require("../constructor.js");
let helper = require("../helper.js");
let library = require("../library/status.js");

let info = {
  id: "gaara",
  name: "Gaara",
  anime: "Naruto",
  author: "",
  pictures: ""
};

let status = {
  invulnerable: library.invulnerable({}),
  stun: library.stun({
    active: 2,
    info: "declusive",
    classes: ["mental"],
    persistence: "control"
  }),
  disableDrIv: library.disableDrIv({
    active: 2
  }),
  ignore: library.ignore({
    active: 4
  }),
  state: library.state({
    name: "Sand Coffin",
    type: "lock",
    info: "Sand Burial",
    active: 3,
    harmful: false
  }),
  dd: library.dd({
    name: "Armor of Sand",
    val: 40,
    active: -1
  }),
  transform: {
    name: "Transform",
    active: 3,
    harmful: false,
    modify: function(payload) {
      if (payload.active === 3) {
        let swap = payload.offense.skill[0];
        payload.offense.skill[0] = payload.offense.skill[4];
        payload.offense.skill[4] = swap;
      } else if (payload.active === 1) {
        let swap = payload.offense.skill[0];
        payload.offense.skill[0] = payload.offense.skill[4];
        payload.offense.skill[4] = swap;
      }
    }
  }
};

let skills = {
  skill1: {
    name: "Sand Coffin",
    type: "attack",
    val: 0,
    cooldown: 2,
    classes: ["physical", "ranged", "control"],
    energy: {
      s: 1,
      r: 1
    },
    target: "enemy",
    description:
      "Gaara surrounds one enemy with a pile of sand stunning their non-mental skills for 2 turns. For 2 turns, that enemy cannot reduce damage or become invulnerable. During this time, this skill will be replaced by 'Sand Burial'.",
    move: function(payload) {
      payload.offense.status.onSelf.push(
        new constructor.status(status.transform, this, 1)
      );
      payload.target.status.onState.push(
        new constructor.status(status.disableDrIv, this, 1),
        new constructor.status(status.state, this, 1),
        new constructor.status(status.stun, this, 1)
      );
    }
  },
  skill2: {
    name: "Sand Clone",
    type: "attack",
    val: 0,
    cooldown: 4,
    classes: ["instant", "chakra"],
    description:
      "Gaara creates a clone of sand that mimics him and provides defense. Until Gaara receives new harmful non-affliction damage, he will ignore all harmful effects except damage and chakra cost changes. This skill cannot be used while active.",
    energy: {},
    target: "self",
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.ignore, this, 2)
      );
    }
  },
  skill3: {
    name: "Armor of Sand",
    cooldown: 4,
    description:
      "By covering himself with sand, Gaara permanently gains 40 points of destructible defense. This skill cannot stack and will re-apply itself.",
    target: "self",
    classes: ["instant", "chakra"],
    energy: {
      r: 1
    },
    move: function(payload) {
      let dd = payload.target.status.onReceive.some(
        x => x.type === "dd" && x.name === this.name
      );
      if (dd) {
        payload.target.status.onReceive = payload.target.status.onReceive.filter(
          x => x.type !== "dd" && x.name !== this.name
        );
      }
      payload.target.status.onReceive.push(
        new constructor.status(status.dd, this, 3)
      );
    }
  },
  skill4: {
    name: "Shield of Sand",
    type: "invulnerable",
    cooldown: 4,
    description:
      "This skill makes Gaara of the Desert invulnerable for 1 turn.",
    target: "self",
    classes: ["instant", "physical"],
    energy: {
      r: 1
    },
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.invulnerable, this, 4)
      );
    }
  },
  skill5: {
    name: "Sand Burial",
    type: "attack",
    val: 100,
    cooldown: 0,
    description:
      "Gaara crushes one enemy with sand. That enemy is killed. This skill requires 'Sand Coffin' to be active on the enemy. This skill cannot be countered or reflected.",
    target: "enemylock",
    classes: ["instant", "ranged", "physical"],
    energy: {
      s: 2
    },
    move: function(payload) {
      payload.target.hp -= 100;
    }
  }
};

let character = {
  name: info.name,
  id: info.id,
  anime: info.anime,
  credit: {
    author: info.author,
    pictures: info.pictures
  },
  hp: 100,
  skill: [
    skills.skill1,
    skills.skill2,
    skills.skill3,
    skills.skill4,
    skills.skill5
  ]
};

module.exports = character;
