function empty(payload) {}

module.exports = {
  character: function(
    payload = {
      name: "",
      hp: 100,
      skill: []
    }
  ) {
    this.name = payload.name;
    this.hp = payload.hp;
    this.status = {
      onAttack: [],
      onReceive: [],
      onSelf: [],
      onState: []
    };
    this.skill = payload.skill;
  },
  skill: function(payload) {
    this.name = payload.name;
    this.type = payload.type;
    this.cooldown = payload.cooldown;
    this.counter = 0
    this.val = payload.val;
    this.move = payload.move;
    this.target = payload.target ? payload.target :  "enemy";
    this.state = payload.state ? payload.state : "active";
    this.required = payload.required ? true : false
    this.mana = payload.mana ? payload.mana : 1
  },
  modifier: function(payload) {
    this.name = payload.name;
    this.active = 2;
    this.val = payload.val;
    this.modify = payload.modify;
    this.type = payload.type;
  },
  status: function(payload) {
    this.name = payload.name;
    this.active = payload.active;
    this.val = payload.val;
    this.modify = payload.modify ? payload.modify : empty;
    this.type = payload.type;
    this.allow = payload.allow ? payload.allow : false;
  }
};
