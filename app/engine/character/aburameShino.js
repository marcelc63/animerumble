let constructor = require("../constructor.js");
let helper = require("../helper.js");
let library = require("../library/status.js");

let info = {
  id: "aburameShino"
};

let status = {
  invincible: library.invincible({
    owner: info.id
  }),
  bleed: library.bleed({
    val: 5,
    active: -1,
    owner: info.id
  }),
  reduce: library.reduce({
    val: 5,
    active: -1,
    owner: info.id
  }),
  boost: {
    name: "Chakra Leech",
    owner: info.id,
    val: 5,
    type: "skill",
    active: -1,
    modify: function(payload) {
      if (payload.offense.skill[payload.skill].name === "Chakra Leech") {
        payload.val += this.val;
      }
    }
  },
  dd: {
    name: "Bug Wall",
    owner: info.id,
    val: 20,
    type: "dd",
    active: -1,
    modify: function(payload) {
      let onReceive = payload.target.status.onReceive;
      let index = onReceive.findIndex(x => x.name === "Bug Wall");
      onReceive[index].val -= this.val;
      if (onReceive[index.val] <= 0) {
        payload.val += onReceive[index.val];
      } else {
        payload.val = 0;
      }
    }
  }
};

let skills = {
  skill1: {
    name: "Chakra Leech",
    type: "attack",
    val: 20,
    cooldown: 1,
    energy: {
      i: 1,
      r: 1
    },
    description:
      "Shino directs his chakra draining bugs to attack one enemy dealing 20 affliction damage and steals 1 random chakra.",
    move: function(payload) {
      let energy = helper.stealEnergy(payload.theirEnergy);
      if (energy !== false) {
        payload.theirEnergy[energy] -= 1;
        payload.myEnergy[energy] += 1;
      }
      payload.target.hp -= payload.val;
    }
  },
  skill2: {
    name: "Female Bug",
    type: "attack",
    val: 15,
    cooldown: 1,
    description:
      "Shino directs one of his female bugs to attach itself to one enemy. For 4 turns, new non-affliction damage that enemy deals is reduced by 5 points. During this time, 'Chakra Leech' will deal 5 additional damage to them. These effects stack.",
    mana: 1,
    energy: {
      r: 1
    },
    target: "enemy",
    move: function(payload) {
      payload.target.status.onAttack.push(
        new constructor.status(status.reduce, this.name, 2)
      );
      payload.target.status.onReceive.push(
        new constructor.status(status.boost, this.name, 2)
      );
    }
  },
  skill3: {
    name: "Bug Wall",
    type: "attack",
    val: 10,
    cooldown: 3,
    description:
      "Shino sends millions of bugs to create a wall around his team, making them gain 20 points of destructible defense.",
    target: "allally",
    marking: true,
    energy: {
      i: 1,
      r: 1
    },
    move: function(payload) {
      payload.target.status.onReceive.push(
        new constructor.status(status.dd, this.name, 3)
      );
    }
  },
  skill4: {
    name: "Shino Hide",
    type: "attack",
    val: 10,
    cooldown: 4,
    description: "This skill makes Aburame Shino invulnerable for 1 turn.",
    target: "self",
    mana: 1,
    energy: {
      r: 1
    },
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.invincible, this.name, 4)
      );
    }
  }
};

let character = {
  name: "Aburame Shino",
  id: "aburameShino",
  hp: 100,
  skill: [
    new constructor.skill(skills.skill1),
    new constructor.skill(skills.skill2),
    new constructor.skill(skills.skill3),
    new constructor.skill(skills.skill4)
  ]
};

module.exports = character;