$(function(){

var stage = new createjs.Stage("mycanvas");
// stage.webkitImageSmoothingEnabled = stage.mozImageSmoothingEnabled = true;
var width  = 770;
var height = 560;
stage.enableMouseOver();

var background;
var chooseC = [];
var chooseE = [];
var choose = false;
var unable = false;
var backgroundImg;
var mycharcont = [];
var health = [];
health[0] = [];
health[1] = [];
var animaHealth = true;
var infocont = [];
var mydivskillscont = [];
var charimages = [];
var touchtime = 0;
var animaskill = false;
var load_b = false;
var skillsimages = [];
var skillAct = [];
skillAct[0] = {};
skillAct[1] = {};
skillAct[2] = {};
var myskilleffect = [];
var myskilleffectcont = [];
myskilleffectcont[0] = 0;
myskilleffectcont[1] = 0;
myskilleffectcont[2] = 0;
var enemyskilleffect = [];
var enemyskilleffectcont = [];
enemyskilleffectcont[0] = 0;
enemyskilleffectcont[1] = 0;
enemyskilleffectcont[2] = 0;


var anima = true;
var targetsanim = [];
targetsanim[0] = [];
targetsanim[1] = [];
var targets = [];
var choice = [];
var queuef = [];
var queuef2 = [];
var queueend = [];
var queueaux = {};
var targetevent = null;
var perfcont = [];
var perfImg = [];
var turncont;
var player = [];
var energy = [];
var chakras = [];
charimages[0] = [];
charimages[1] = [];
var enemycharcont = [];
var battle_status = 'getFirstload';

var chooseEx = false;
var var_sel_ex = null;
var var_ex = false;
var ex_char = [];
var my_ex = [];
var cho_ex = [];
var auxcho_ex = [];
var auxex_char = [];
var auxvar_sel_ex = null;
ex_char[0] = 0;
ex_char[1] = 0;
ex_char[2] = 0;
ex_char[3] = 0;
cho_ex[0] = 0;
cho_ex[1] = 0;
var_sel_ex = null;
var recon = false;

var connection_lost = false;
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjlkNTAyYzU3Njc4ZTQ0ZTZkOWNjMWQiLCJpYXQiOjE1MzcwNjA0MTQsImV4cCI6MTUzOTY1MjQxNH0.7dew4gGs6wxkT5X4qeEF3Si4icqyfw3Jhh46U5bUy74';
const token = localStorage.jwtToken;
var socket = io({query: {token: token}});

$( document ).ready(function() {
  socket.emit('connectbattle');
});

socket.on('reconnect', () => {
  console.log('you have been reconnected');
  recon = true;
  socket.emit('connectbattle','recon');
});
socket.on('reconnect_error', () => {
  console.log('attempt to reconnect has failed');
});

socket.on('connectbattle',function() {
  socket.emit('connectbattle','getTurn');
});
socket.on('rec',function() {
  connection_lost = false;
  stage.getChildByName('fImg').visible = false;
});
socket.on('disconnect',function() {
  console.log('Disconnected');
  if(player.turn != 'loser' && player.turn != 'winner'){
    connection_lost = true;
    stage.getChildByName('fImg').visible = true;
  }
});

socket.on('nobattle',function() {
  window.location = "/selection";

});
socket.on('getFirstload',function(data) {

  player = data;
  queuef2 = [];

  if(player.queue.length > 0){
    for (var i = 0; i < player.queue.length; i++) {
      queuef2.push(player.queue[i]);
    }
  }

  loadImgs();
});

background = new createjs.Bitmap();
stage.addChild(background);

function createdivs(){
  for(var i=0;i<3;i++){
    var skillsdiv = new createjs.Container();

    var div = new createjs.Bitmap();

    div.image = skillsdivImg;
    div.name = 'divskills';
    // div.alpha = 0.5;

    div.x = 28;
    div.y =  88+(i*120)+1*i;


    stage.addChild(skillsdiv);
    var charshape = new createjs.Shape();
    charshape.alpha = 0;
    charshape.graphics.beginStroke("#000000");
    charshape.graphics.setStrokeStyle(1);
    charshape.snapToPixel = true;
    charshape.graphics.drawRect(100, div.y, 500, 200);
    charshape.x = skillsdiv.x - 0.5;
    charshape.y = skillsdiv.y - 0.5;
    skillsdiv.mask = charshape;
    stage.addChild(charshape);

    skillsdiv.addChild(div);

    myskilleffect[i] = [];

    for (var y = 0; y < 9; y++) {
        var skilleffect = new createjs.Bitmap();
        // skilleffect.image = skillsimages[i][0];
        skilleffect.name = 'skill';
        skilleffect.scaleX = 0.28;
        skilleffect.scaleY = 0.28;
        var shape = new createjs.Shape();
        shape.name = 'borda';
        shape.graphics.beginStroke("#000");
        shape.graphics.setStrokeStyle(1);
        shape.snapToPixel = true;
        shape.graphics.drawRect(0, 0, 22, 22);
        shape.x = skilleffect.x - 0.5;
        shape.y = skilleffect.y - 0.5;
        skilleffect.mask = shape;
        var cont = new createjs.Container();
        cont.name = 'skilleffectcont'+y;
        cont.x = 115+(y*25)+(y*1);
        cont.y = 64+(i*120)+1*i;
        cont.addChild(shape);
        cont.addChild(skilleffect);


        cont.addEventListener('mouseover',function(event){
          var skill = event.currentTarget;
          if(skill.no_over == false){
            var desc = stage.getChildByName('contdescskill');
            var desctxt = desc.getChildByName('conttext');
            desc.alpha = 1;
            desc.x = skill.x;
            desc.y = skill.y + 25;
            desctxt.removeAllChildren();
            var nametxt = new createjs.Text('', "bold 11px Franklin", "#bd262c");
            nametxt.name = 'nametxt';
            nametxt.textBaseline = "alphabetic";
            nametxt.text =  skill.nameskill.toUpperCase();
            desctxt.addChild(nametxt);
            var tam = 0;
            for(var g = 0; g < skill.desc.length;g++){
              var description = new createjs.Text('', "10px Franklin", "#151311");
              description.name = 'desctxt';
              description.x = 5;
              description.y = 10+tam;
              description.text = skill.desc[g].desc.toUpperCase();
              description.textBaseline = "alphabetic";
              description.lineWidth = 240;
              description.lineHeight = 12;

              desctxt.addChild(description);

              var turntxt = new createjs.Text('', " 10px Franklin", "#bd262c");
              turntxt.name = 'turntxt';
              turntxt.textBaseline = "alphabetic";
              turntxt.y = description.getMetrics().height + description.y + 2;

              turntxt.text = skill.desc[g].turns.toUpperCase();
              desctxt.addChild(turntxt);
              tam += description.getMetrics().height  + turntxt.getMetrics().height + 5;

            }
            // if(tam < 50 )tam = 50;

            desc.getChildByName('borda').graphics.clear().beginStroke("#000").drawRect(0, 0, 255, tam+20);

          }

        });
        cont.addEventListener('mouseout',function(event){
          // console.log('mouseout');
          var desc = stage.getChildByName('contdescskill');
          desc.alpha = 0;
        });



        cont.alpha = 0;

        stage.addChild(cont);
        myskilleffect[i][y] = cont;

    }

    for ( y = 0; y < 4; y++) {
      var skill = new createjs.Bitmap();
      skill.image = skillsimages[player[0][i].character_id][player[0][i][y].skill_id];

      skill.name = 'skill';
      skill.scaleX = 0.72;
      skill.scaleY = 0.72;
      var shape = new createjs.Shape();
      shape.name = 'borda';
      shape.graphics.beginStroke("#000");
      shape.graphics.setStrokeStyle(1);
      shape.snapToPixel = true;
      shape.graphics.drawRect(0, 0, 55, 55);
      shape.x = skill.x - 0.5;
      shape.y = skill.y - 0.5;
      skill.mask = shape;

      var cool = new createjs.Text('2', "50px Pedra", "#151311");
      cool.name = 'cool';
      cool.textAlign = "center";
      cool.textBaseline = "alphabetic";

      cool.x = 27;
      cool.y = 47;
      cool.alpha = 0;

      var cont = new createjs.Container();
      cont.name = 'skillcont'+y;
      cont.x = 127+(y*61)+(y*1);
      cont.old_x = 127+(y*61)+(y*1);
      cont.y = 99+(i*120)+1*i;

      cont.addChild(shape);
      cont.addChild(skill);
      cont.addChild(cool);
      cont.p = 0;
      cont.c = i;
      cont.character_id = player[0][i].character_id;
      cont.skill_id = player[0][i][y].skill_id;
      cont.s = y;
      // cont.addEventListener("dblclick",desSkill);
      cont.addEventListener("click",function(event){
        var skillc = event.currentTarget;
        if(skillAct[skillc.c].s == skillc.s){
          dbclick(event);
        }else{
          // targets = JSON.parse(player[event.currentTarget.p][event.currentTarget.c][event.currentTarget.s].targets);
          if(!useSkill(skillc.c,skillc.s)){
            choice = player.target[skillc.c][skillc.s].c;
            targets = player.target[skillc.c][skillc.s].t;

            queueaux.c = skillc.p+''+skillc.c;
            queueaux.character_id = skillc.character_id;

            queueaux.s = skillc.s;
            queueaux.skill = player[skillc.p][skillc.c][skillc.s].skill_id;
            var id = targets.indexOf('himself');
            if(id != -1)targets.splice(id, 1, skillc.p+''+skillc.c);

            id = choice.indexOf('himself');
            if(id != -1)choice.splice(id, 1, skillc.p+''+skillc.c);

            var id = targets.indexOf('non-himself');
            if(id != -1){
              targets.splice(id, 1);
              var id2 = targets.indexOf(skillc.p+''+skillc.c);
              if(id2 != -1)targets.splice(id2, 1);
            }

            id = choice.indexOf('non-himself');
            if(id != -1){
              choice.splice(id, 1);
              var id2 = choice.indexOf(skillc.p+''+skillc.c);
              if(id2 != -1)choice.splice(id2, 1);
            }


            createtargetsanima();
          }else{
            targets = [];
            choice = [];
          }
        }
        var energy = player[skillc.p][skillc.c][skillc.s].energy;
        infocont.getChildByName('infoimgcont').getChildByName('imagecont').image = skillsimages[skillc.character_id][skillc.skill_id];
        infocont.getChildByName('infoname').text = player[skillc.p][skillc.c][skillc.s].name.toUpperCase();
        infocont.getChildByName('energycont').alpha = 1;
        for (var k = 0; k < 5; k++) {
          infocont.getChildByName('energycont').getChildByName('energy_'+k).alpha = 0;
        }
        if(energy[0]+energy[1]+energy[2]+energy[3]+energy[4] == 0){

          infocont.getChildByName('energycont').getChildByName('infoenergy').text = 'ENERGY:  NONE';
        }else {
          infocont.getChildByName('energycont').getChildByName('infoenergy').text = 'ENERGY: ';


          var cont = 0;
          for (var y in energy) {
            if(energy[y] == 1){
              infocont.getChildByName('energycont').getChildByName('energy_'+cont).image = chakras[y];
              infocont.getChildByName('energycont').getChildByName('energy_'+cont).alpha = 1;
              cont++;

            }
            if(energy[y] > 1){
              for (var r = 0; r < energy[y]; r++) {
                infocont.getChildByName('energycont').getChildByName('energy_'+cont).image = chakras[y];
                infocont.getChildByName('energycont').getChildByName('energy_'+cont).alpha = 1;
                cont++;

              }
            }
          }
        }
        infocont.getChildByName('infoclasslist').alpha = 1;
        var clas = 'CLASSLIST: ';
        var classes = player[skillc.p][skillc.c][skillc.s].classlist;
        for (var z in classes) {
          if(z==0)clas += classes[z].toUpperCase();
          else clas += ', '+classes[z].toUpperCase();
        }
        infocont.getChildByName('infoclasslist').text = clas;

        infocont.getChildByName('infocooldown').alpha = 1;
        if(player[skillc.p][skillc.c][skillc.s].cooldown >0)infocont.getChildByName('infocooldown').text = 'COOLDOWN: '+ parseInt(player[skillc.p][skillc.c][skillc.s].cooldown);
        else infocont.getChildByName('infocooldown').alpha = 0;
        // else infocont.getChildByName('infocooldown').text = 'COOLDOWN: NONE';

        infocont.getChildByName('infodesc').text = player[skillc.p][skillc.c][skillc.s].description.toUpperCase();
        infocont.getChildByName('infoclan').alpha = 0;
        infocont.getChildByName('infolevel').alpha = 0;
        infocont.getChildByName('infoladder').alpha = 0;
        infocont.getChildByName('inforatio').alpha = 0;

        for (var i = 0; i < 3; i++) {
          infocont.getChildByName('infoteamcont'+i).alpha = 0;
        }
      //  stage.update();
        //console.log(stage.numChildren);

      });
      skillsdiv.addChild(cont);

    }


    // skillsdiv.addChild(perg);
    mydivskillscont[i] = skillsdiv;
    // if(player.turn == 'PlayerTurn')mydivskillscont[i].x = 75;
    // else mydivskillscont[i].x = -3;
    mydivskillscont[i].x = -310;
  }
  // var crop = new createjs.Bitmap();
  //
  // crop.sourceRect = new createjs.Rectangle(0,0,100,700);
  // crop.y = 0;
  // crop.image = backgroundImg;
  //
  // stage.addChild(crop);

  for(var i=0;i<3;i++){

    var perg = new createjs.Bitmap();
    perg.image = pergImg;
    perg.name = 'perg';
    perg.x = 81;
    perg.y = 83+(i*120)+1*i;


    stage.addChild(perg)
  }

}
var endt = true;
function createperf(){
  // textAlign
  var turn = new createjs.Container();
  turn.name = 'turncont';
  var turntxt = new createjs.Text('PRESS WHEN READY', "16px Franklin", "#151311");
  turntxt.name = 'turntxt';
  turntxt.textBaseline = "alphabetic";
  turntxt.y = 15;


  turntxt.textAlign = "center";


  turn.addChild(turntxt);
  turn.addEventListener("click",function(event){
    if(endt)chooseChakra();
    endt = false;


  });
  var chacont = new createjs.Container();
  chacont.name = 'chakracont';
  for (var i = 0; i < 5; i++) {
    if(i != 4){
      var cha = new createjs.Bitmap();
      cha.image = chakras[i];
      cha.x = 40*i+(i*1);
      chacont.addChild(cha);
    }

    var chartxt = new createjs.Text('x '+player.energy[i], "14px Franklin", "#000");
    chartxt.x = 15+40*i+(i*1);
    chartxt.y = 9;
    chartxt.name = 'chakra_'+i;
    chartxt.textBaseline = "alphabetic";


    if(i==4){
      var t = new createjs.Text('T', "13px Pedra", "#000");
      t.x = 164;
      t.y = 9;
      t.textBaseline = "alphabetic";

      // chartxt.font = '8px Pedradecrack';
      chartxt.x = 177;
      chartxt.text = 'x '+player.energy[4];
      chacont.addChild(t);

    }
    chacont.addChild(chartxt);



  }
  chacont.x = 293;
  chacont.y = 49;
  stage.addChild(chacont);




  var ex = new createjs.Text('EXCHANGE CHAKRA', "12px Franklin", "#000");

  ex.name = 'exchange';
  ex.y = 72;
  ex.x = 348;
  ex.textBaseline = "alphabetic";
  ex.addEventListener('click',function(event) {
    chooseChakraEx();
  });

  stage.addChild(ex);
  turn.x = 390;
  turn.y = 11;

  if(player.turn == 'OpponentTurn'){
    turntxt.text = 'OPPONENT TURN...';
    chacont.alpha = 0;
    ex.alpha = 0;
  }

  var lifeshape = new createjs.Shape();
  var lifeshape1 = new createjs.Shape();
  lifeshape1.name = 'lifeborda';

  lifeshape.name = 'lifebranco';

  var life = new createjs.Shape();
  life.name = 'life';
  lifeshape1.graphics.beginFill("#000").drawRect(-97,17,193,12);
  lifeshape.graphics.beginFill("#ffff").drawRect(-96,18,191,10);
  life.graphics.beginFill("#ba1921").drawRect(-96,18,191,10);

  turn.addChild(lifeshape1);
  turn.addChild(lifeshape);
  turn.addChild(life);
  turncont = turn;
  stage.addChild(turn);



  for (var i = 0; i < 2; i++) {
    var perf = new createjs.Container();

    var img = new createjs.Bitmap();
    img.image = perfImg[i];
    img.name = 'avatar';
    img.scaleX = 0.64;
    img.scaleY = 0.64;
    if(i==0)img.x = 114;
    else img.x = 0;
    img.y = 3;

    var shape = new createjs.Shape();
    shape.name = 'borda';
    shape.graphics.beginStroke("#000");
    shape.graphics.setStrokeStyle(1);
    shape.snapToPixel = true;
    shape.graphics.drawRect(0, 0, 49, 49);
    shape.x = img.x - 0.5;
    shape.y = img.y - 0.5;
    img.mask = shape;

    perf.addChild(img);
    perf.addChild(shape);


    var user = new createjs.Text(player[i].username.toUpperCase(), "20px Franklin", "#bd262c");

    user.y = 26;
    user.name = 'username';
    user.textBaseline = "alphabetic";

    if(i==0){
      user.x = 105;
      user.textAlign = "right";
    }else{
      user.x = 58;
      user.textAlign = "left";
     }

    perf.addChild(user);

    var rank = new createjs.Text(player[i].rank.toUpperCase(), "15px Franklin", "#151311");
    rank.x = 105;
    rank.y = 47;
    rank.name = 'rank';
    rank.textBaseline = "alphabetic";

    if(i==0){
      rank.textAlign = "right";
    }
    else {
      rank.x = 58;
      rank.textAlign = "left";
    }

    perf.addChild(rank);
    perf.x = 110+(i*397);
    perf.y= 7;
    perf.p = i;



    perf.addEventListener("click",function(event){
      targets = [];
      var neww = new createjs.Bitmap();
      // console.log('ennn');
      neww.image = perfImg[event.currentTarget.p];
      infocont.getChildByName('infoimgcont').getChildByName('imagecont').image = neww.image;
      infocont.getChildByName('infoname').text = player[event.currentTarget.p].username.toUpperCase();
      infocont.getChildByName('energycont').alpha = 0;
      infocont.getChildByName('infoclasslist').alpha = 0;
      infocont.getChildByName('infocooldown').alpha = 0;
      infocont.getChildByName('infodesc').text = player[event.currentTarget.p].rank.toUpperCase();
      infocont.getChildByName('infoclan').alpha = 1;
      infocont.getChildByName('infoclan').text = 'CLAN: '+ player[event.currentTarget.p].clan.toUpperCase();
      infocont.getChildByName('infolevel').alpha = 1;
      infocont.getChildByName('infolevel').text =  'LEVEL: '+ player[event.currentTarget.p].level;
      infocont.getChildByName('infoladder').alpha = 1;
      infocont.getChildByName('infoladder').text =  'LADDERRANK: '+ player[event.currentTarget.p].ladderrank;
      infocont.getChildByName('inforatio').alpha = 1;
      infocont.getChildByName('inforatio').text = 'RATIO: '+ player[event.currentTarget.p].wins + ' - ' + player[event.currentTarget.p].losses + ' ('+player[event.currentTarget.p].streak+')';

      for (var i = 0; i < 3; i++) {
        infocont.getChildByName('infoteamcont'+i).alpha = 1;
        infocont.getChildByName('infoteamcont'+i).getChildByName('infoteam').image = charimages[event.currentTarget.p][i];

      }

      // stage.update();
      //console.log(stage.numChildren);

    });

    stage.addChild(perf);

    perfcont[i] =  perf;


  }

}
function createchars(p){


  for (var i = 0; i < 3; i++) {
    var char = new createjs.Bitmap();
    if(p == 0)char.x = 33;
    else char.x = (width)-35;

    char.y = 64+(120*i)+(i*1);
    if(p == 0)char.image = charimages[p][i];
    else char.image = charimages[p][i];
    char.name = 'image';
    if(p == 1)char.scaleX = -1;

    var rank = new createjs.Bitmap();
    if(p == 0)rank.x = 0;
    else rank.x = (width)-2;

    rank.y = 33+(120*i)+(i*1);
    if(p == 0)rank.image = userrank;
    else rank.image = enemyrank;
    rank.name = 'rank';
    if(p == 1)rank.scaleX = -1;


    var rankv2 = new createjs.Bitmap();
    if(p == 0)rankv2.x = 0;
    else rankv2.x = (width)-2;

    rankv2.y = 33+(120*i)+(i*1);
    if(p == 0)rankv2.image = userrankv2;
    else rankv2.image = enemyrankv2;
    rankv2.name = 'rank';
    if(p == 1)rankv2.scaleX = -1;

    enemyskilleffect[i] = [];

    for (var y = 0; y < 9; y++) {
        var skilleffect = new createjs.Bitmap();
        // skilleffect.image = skillsimages[i][1];
        skilleffect.name = 'skill';
        skilleffect.scaleX = 0.28;
        skilleffect.scaleY = 0.28;
        var shape = new createjs.Shape();
        shape.name = 'borda';
        shape.graphics.beginStroke("#000");
        shape.graphics.setStrokeStyle(1);
        shape.snapToPixel = true;
        shape.graphics.drawRect(0, 0, 22, 22);
        shape.x = skilleffect.x - 0.5;
        shape.y = skilleffect.y - 0.5;
        skilleffect.mask = shape;
        var cont = new createjs.Container();
        cont.name = 'skilleffectcont'+y;
        cont.x = (width)-137-(y*25)-(y*1);
        cont.y = 64+(i*120)+1*i;
        cont.addChild(shape);
        cont.addChild(skilleffect);

        cont.alpha = 0;

        cont.addEventListener('mouseover',function(event){
          var skill = event.currentTarget;
          if(skill.no_over == false){
            var desc = stage.getChildByName('contdescskill');
            var desctxt = desc.getChildByName('conttext');
            desc.alpha = 1;
            desc.x = skill.x-233;
            desc.y = skill.y + 25;
            desctxt.removeAllChildren();
            var nametxt = new createjs.Text('', "bold 11px Franklin", "#bd262c");
            nametxt.name = 'nametxt';
            nametxt.textBaseline = "alphabetic";
            nametxt.text =  skill.nameskill.toUpperCase();
            desctxt.addChild(nametxt);
            var tam = 0;
            for(var g = 0; g < skill.desc.length;g++){
              var description = new createjs.Text('', "10.4px Franklin", "#151311");
              description.name = 'desctxt';
              description.x = 5;

              description.y = 10+tam;
              description.text = skill.desc[g].desc.toUpperCase();
              description.textBaseline = "alphabetic";
              description.lineWidth = 240;
              description.lineHeight = 12;

              desctxt.addChild(description);

              var turntxt = new createjs.Text('', " 10px Franklin", "#bd262c");
              turntxt.name = 'turntxt';
              turntxt.textBaseline = "alphabetic";
              turntxt.y = description.getMetrics().height + description.y + 2;

              turntxt.text = skill.desc[g].turns.toUpperCase();
              desctxt.addChild(turntxt);
              tam += description.getMetrics().height  + turntxt.getMetrics().height + 5;

            }
            // if(tam < 50)tam = 50;
            desc.getChildByName('borda').graphics.clear().beginStroke("#000").drawRect(0, 0, 255, tam+20);
          }
        });
        cont.addEventListener('mouseout',function(event){
          // console.log('mouseout');
          var desc = stage.getChildByName('contdescskill');
          desc.alpha = 0;
        });


        stage.addChild(cont);
        enemyskilleffect[i][y] = cont;

    }
    var charcont = new createjs.Container();
    charcont.p = p;
    charcont.c = i;

    charcont.addEventListener("click",function(event){
      selectHere(event.currentTarget.p,event.currentTarget.c);
    });
    var charshape = new createjs.Shape();
    charshape.name = 'borda';
    charshape.graphics.beginStroke("#000");
    charshape.graphics.setStrokeStyle(1);
    charshape.snapToPixel = true;
    charshape.graphics.drawRect(0, 0, 76, 76);
    if(p == 0)charshape.x = char.x - 0.5;
    else charshape.x = char.x-75 - 0.5;

    var taregtshape = new createjs.Shape();
    taregtshape.name = 'target';
    taregtshape.graphics.beginFill("yellow");
    // taregtshape.graphics.setStrokeStyle(1);
    // taregtshape.snapToPixel = true;
    taregtshape.graphics.drawRect(0, 0, 75, 75);
    if(p == 0)taregtshape.x = char.x;
    else taregtshape.x = char.x-75;
    taregtshape.y = char.y;
    taregtshape.alpha = 0;
    targetsanim[p][i] = taregtshape;
    charshape.y = char.y - 0.5;
    char.mask = charshape;
    charcont.addChild(rankv2);
    charcont.addChild(char);
    charcont.addChild(charshape);

    charcont.addChild(taregtshape);
    charcont.addChild(rank);

    stage.addChild(charcont);


    var lifeshape = new createjs.Shape();
    var lifeshape1 = new createjs.Shape();
    lifeshape1.name = 'lifeborda';

    lifeshape.name = 'lifebranco';

    var life = new createjs.Shape();
    life.name = 'life';
    var lifetxt = new createjs.Text(player.healths[p][i]+'/100', "12px Franklin", "#151311");
    lifetxt.name = 'lifetext';
    lifetxt.textAlign = 'center';
    lifetxt.textBaseline = "alphabetic";


    if(p == 0){
      lifeshape1.graphics.beginFill("#000").drawRect(32,142+(i*120)+1*i,77,16);
      lifeshape.graphics.beginFill("#ffff").drawRect(33,143+(i*120)+1*i,75,14);
      life.graphics.beginFill("#3bdf3f").drawRect(33,143+(i*120)+1*i,(player.healths[p][i]/100)*75,14);

      lifetxt.x = 70;
      lifetxt.y = 144+(i*120)+1*i;
    }else{
      lifeshape1.graphics.beginFill("#151311").drawRect((width)-111,142+(i*120)+1*i,77,16);
      lifeshape.graphics.beginFill("#ffff").drawRect((width)-110,143+(i*120)+1*i,75,14);
      life.graphics.beginFill("#3bdf3f").drawRect((width)-110,143+(i*120)+1*i,(player.healths[p][i]/100)*75,14);
      lifetxt.x = width-72;
      lifetxt.y = 144+(i*120)+1*i;
    }

    charcont.addChild(lifeshape1);
    charcont.addChild(lifeshape);
    charcont.addChild(life);
    charcont.addChild(lifetxt);

    if(p == 0)mycharcont[i] = charcont;
    else enemycharcont[i] = charcont;
  }
}

function createinfo() {
  var infodiv = new createjs.Bitmap();
  infodiv.image = infodivImg;
  infodiv.name = 'info';
  var infodivc = new createjs.Container();
  infodivc.addChild(infodiv);
  // infodivc.alpha = 0.4;

  stage.addChild(infodivc);

  var char = new createjs.Bitmap();
  char.image = perfImg[1];
  char.name = 'imagecont';
  var charshape = new createjs.Shape();
  charshape.name = 'borda';
  charshape.graphics.beginStroke("#000");
  charshape.graphics.setStrokeStyle(1);
  charshape.snapToPixel = true;
  charshape.graphics.drawRect(0, 0, 76, 76);
  charshape.x = char.x - 0.5;
  charshape.y = char.y - 0.5;
  char.mask = charshape;
  var charcont = new createjs.Container();
  charcont.name = 'infoimgcont';
  charcont.x = 31;
  charcont.y = 29;

  charcont.addChild(char);
  charcont.addChild(charshape);

  infodivc.addChild(charcont);
  var infotxtname = new createjs.Text(player[1].username.toUpperCase(), "15px Franklin", "#bd262c");
  infotxtname.x = 115;
  infotxtname.y = 39;
  infotxtname.name = 'infoname';
  infotxtname.textBaseline = "alphabetic";


  infodivc.addChild(infotxtname);

  var infotxtname = new createjs.Text('ENERGY: ', "10px Franklin", "#7d6f4c");

  infotxtname.name = 'infoenergy';
  infotxtname.alpha = 1;
  infotxtname.y = 9;

  infotxtname.textBaseline = "alphabetic";







  var energycont = new createjs.Container();
  energycont.name = 'energycont';
  energycont.x = 417;
  energycont.y = 29;
  energycont.alpha = 0;
  energycont.addChild(infotxtname);
  for (var i = 0; i < 5; i++) {
    var chak = new createjs.Bitmap();
    chak.image = chakras[4];
    chak.x = 37+ i*13;
    // chak.y = -1;
    chak.name = 'energy_'+i;
    chak.alpha = 0;
    energycont.addChild(chak);

  }
  infodivc.addChild(energycont);

  infotxtname = new createjs.Text(player[1].rank.toUpperCase(), "12px Franklin", "#151311");
  infotxtname.x = 115;
  infotxtname.y = 52;
  infotxtname.lineWidth  = 390;
  infotxtname.name = 'infodesc';
  infotxtname.textBaseline = "alphabetic";


  infodivc.addChild(infotxtname);

  infotxtname = new createjs.Text('CLAN: '+player[1].clan.toUpperCase()+'', "12px Franklin", "#151311");
  infotxtname.x = 115;
  infotxtname.y = 65;
  infotxtname.name = 'infoclan';
  infotxtname.textBaseline = "alphabetic";


  infodivc.addChild(infotxtname);

  infotxtname = new createjs.Text('LEVEL: '+player[1].level, "12px Franklin", "#151311");
  infotxtname.x = 115;
  infotxtname.y = 77;
  infotxtname.name = 'infolevel';
  infotxtname.textBaseline = "alphabetic";


  infodivc.addChild(infotxtname);

  infotxtname = new createjs.Text('LADDERRANK: '+player[1].ladderrank, "12px Franklin", "#151311");
  infotxtname.x = 115;
  infotxtname.y = 91;
  infotxtname.name = 'infoladder';
  infotxtname.textBaseline = "alphabetic";


  infodivc.addChild(infotxtname);

  infotxtname = new createjs.Text('RATIO: '+player[1].wins+' - '+player[1].losses+' ('+player[1].streak+')', "12px Franklin", "#151311");
  infotxtname.x = 115;
  infotxtname.y = 105;
  infotxtname.name = 'inforatio';
  infotxtname.textBaseline = "alphabetic";

    // infotxtname.font = '20px Arial';
    // infotxtname.color = 'red';

  // infotxtname.alpha = 0;

  infodivc.addChild(infotxtname);

  infotxtname = new createjs.Text('CLASSES: CHAKRA, RANGED, INSTANT', "10px Franklin", "#7d6f4c");
  infotxtname.x = 115;
  infotxtname.y = 105;
  infotxtname.name = 'infoclasslist';
  infotxtname.alpha = 0;
  infotxtname.textBaseline = "alphabetic";


  infodivc.addChild(infotxtname);

  infotxtname = new createjs.Text('COOLDOWN: 1', "10px Franklin", "#7d6f4c");
  infotxtname.x = 415;
  infotxtname.y = 105;
  infotxtname.name = 'infocooldown';
  infotxtname.alpha = 0;
  infotxtname.textBaseline = "alphabetic";


  infodivc.addChild(infotxtname);

  for (var i = 0; i < 3; i++) {
    char = new createjs.Bitmap();
    char.image = charimages[1][i];
    char.name = 'infoteam';
    char.scaleX = 0.72;
    char.scaleY = 0.72;
    charshape = new createjs.Shape();
    charshape.name = 'borda';
    charshape.graphics.beginStroke("#000");
    charshape.graphics.setStrokeStyle(1);
    charshape.snapToPixel = true;
    charshape.graphics.drawRect(0, 0, 55, 55);
    charshape.x = char.x - 0.5;
    charshape.y = char.y - 0.5;
    char.mask = charshape;
    charcont = new createjs.Container();
    charcont.name = 'infoteamcont'+i;
    charcont.x = 314+(i*65)+(i*1);
    charcont.y = 40;
    charcont.addChild(charshape);
    charcont.addChild(char);
    // charcont.alpha = 0;
    infodivc.addChild(charcont);
  }


  infocont = infodivc;

  infocont.x = 248;
  infocont.y = 425;



}
function createmenu(){
  var render = new createjs.Bitmap();
  render.image = surrenderImg;
  render.x = 54;
  render.y = 425;
  // render.sc41eY = 0.4;
  // render.scaleX = 0.4;
  stage.addChild(render);

  render.addEventListener('click', function(event) {
    surrender = true;
    stage.getChildByName('fImg').visible = true;
  });

  // render = new createjs.Bitmap();
  // render.image = chatImg;
  // render.x = 30;
  // render.y = 467;
  // // render.sc41eY = 0.4;
  // // render.scaleX = 0.4;
  // stage.addChild(render);
  //
  // render = new createjs.Bitmap();
  // render.image = chatImg;
  // render.x = 7;
  // render.y = 509;
  // // render.sc41eY = 0.4;
  // // render.scaleX = 0.4;
  // stage.addChild(render);

  render = new createjs.Bitmap();
  render.image = narutoinfoImg;
  render.x = 100;
  render.y = 385;
  stage.addChild(render);


}
function loadImgs(){
  var loader = new PxLoader();

  // backgroundImg = loader.addImage('http://i1249.photobucket.com/albums/hh518/SwizzyManeLeFlare/NarutoArenaBGs/Nindaime.png');

  if(player[0].background != '' && player[0].background != undefined)
    backgroundImg = loader.addImage(''+player[0].background);
  else
    backgroundImg = loader.addImage('https://i.imgur.com/jQ7UZwj.png');

  descImg = loader.addImage('images/desc.png');

  backgroundImg.crossOrigin = true;
  userrank = loader.addImage('images/ranks/'+player[0].rank+'.png');
  userrankv2 = loader.addImage('images/ranks/'+player[0].rank+'v2.png');
  enemyrank = loader.addImage('images/ranks/'+player[1].rank+'.png');
  enemyrankv2 = loader.addImage('images/ranks/'+player[1].rank+'v2.png');
  skillsdivImg = loader.addImage('images/skillsdiv2.png');
  narutoinfoImg = loader.addImage('images/render.png');
  endgameImg = loader.addImage('images/endgame.png');
  fImg = loader.addImage('images/f.png');
  endwinImg = loader.addImage('images/endwinner.jpg');
  endlosImg = loader.addImage('images/endloser.jpg');
  deadImg = loader.addImage('images/dead.png');
  surrenderImg = loader.addImage('images/surrender.png');
  surrenderMImg = loader.addImage('images/surrender.jpg');
  chatImg = loader.addImage('images/infodivinha.png');
  infodivImg = loader.addImage('images/infodiv.png');
  chakras[0] = loader.addImage('images/b_0.png');
  chakras[1] = loader.addImage('images/b_1.png');
  chakras[2] = loader.addImage('images/b_2.png');
  chakras[3] = loader.addImage('images/b_3.png');
  chakras[4] = loader.addImage('images/b_4.png');
  kunai1 = loader.addImage('images/kunai.png');
  kunai2 = loader.addImage('images/kunai2.png');
  shuri = loader.addImage('images/shuri.png');
  mais = loader.addImage('images/+.png');
  menos = loader.addImage('images/-.png');
  chooserImg= loader.addImage('images/chooserandom.png');
  exchangeImg= loader.addImage('images/exchange.png');
  chooseImg= loader.addImage('images/choose.png');
  okImg = loader.addImage('images/ok.png');
  cancelImg = loader.addImage('images/cancel.png');

  pergImg = loader.addImage('images/perg.png');
  // perfImg[0] = loader.addImage('https://i.imgur.com/l7iBg43.jpg');
  perfImg[0] = loader.addImage(''+player[0].avatar);
  perfImg[0].crossOrigin = true;

  perfImg[1] = loader.addImage(''+player[1].avatar);

  // perfImg[1] = loader.addImage('https://i.imgur.com/oMbzgjq.jpg');
  perfImg[1].crossOrigin = true;
  // perfImg[0]= loader.addImage('images/characters/1/large.png');
  // perfImg[1]= loader.addImage('images/characters/1/large.png');

  for (var i = 0; i < 2; i++) {
    for (var y = 0; y < 3; y++) {
      charimages[i][y] = loader.addImage(player[i][y].image);
      charimages[i][y].crossOrigin = true;
    }
  }

  for (i = 0; i < player.skills.length; i++) {
    if(player.skills[i] != null){

      skillsimages[i] = [];
      for (y = 0; y < player.skills[i].length; y++) {
        if(player.skills[i][y].flag){
          skillsimages[i][y] = loader.addImage(player.skills[i][y].image);
          skillsimages[i][y].crossOrigin = true;
        }
      }

    }
  }


  loader.addCompletionListener(function() {
    $("#load").remove();

      background.image = backgroundImg;

      createdivs();
      createperf();

      createchars(0);
      createchars(1);
      createinfo();
      createmenu();
      createEndgame();
      atualizaturno();
      //validaskill();
      createchoose();
      createexchange();
      createsurrender();
      createunable();
      createconlost();
      createDes();
      createcursor();
      if(player.turn != 'loser' && player.turn != 'winner')createTimer();


    //  stage.update();

    });
  loader.start();

}
function loadEffects() {
  for (var i = 0; i < 2; i++) {
    for (var y = 0; y < 3; y++) {
      for (var w = 0; w < player.effects[i][y].length; w++) {

        if (i==0) {
          myskilleffect[y][myskilleffectcont[y]].alpha = 1;
          myskilleffect[y][myskilleffectcont[y]].no_over = false;

          myskilleffect[y][myskilleffectcont[y]].nameskill = player.effects[i][y][w].skill_name;
          myskilleffect[y][myskilleffectcont[y]].desc = player.effects[i][y][w].description;

          myskilleffect[y][myskilleffectcont[y]].getChildByName('skill').image = skillsimages[parseInt(player.effects[i][y][w].character_id)][parseInt(player.effects[i][y][w].skill_id)];
          myskilleffectcont[y]++;
        }else {
          enemyskilleffect[y][enemyskilleffectcont[y]].nameskill = player.effects[i][y][w].skill_name;
          enemyskilleffect[y][enemyskilleffectcont[y]].desc = player.effects[i][y][w].description;

          enemyskilleffect[y][enemyskilleffectcont[y]].no_over = false;
          enemyskilleffect[y][enemyskilleffectcont[y]].alpha = 1;
          enemyskilleffect[y][enemyskilleffectcont[y]].getChildByName('skill').image = skillsimages[parseInt(player.effects[i][y][w].character_id)][parseInt(player.effects[i][y][w].skill_id)];
          enemyskilleffectcont[y]++;
        }
      }
    }

  }
}
var dead = [];
dead[0] = [];
dead[1] = [];
function attHealth() {
  for (var y = 0; y < 2; y++) {
    for (var i = 0; i < 3; i++) {
      // console.log(health[0][i]);
      if(health[y][i] == undefined){
        health[y][i] = player.healths[y][i];
      }else if(health[y][i] > player.healths[y][i]){
        if(health[y][i] - 2 <= 0 && player.healths[y][i] == 0){
          // console.log('morto');
        }
        health[y][i] = health[y][i] - 2;
        if(health[y][i] < player.healths[y][i]){
          health[y][i] = player.healths[y][i];
        }

      }else if (health[y][i] < player.healths[y][i]) {
        health[y][i] = health[y][i] + 2;
        if(health[y][i] > player.healths[y][i]){
          health[y][i] = player.healths[y][i];
        }
      }
      if(health[y][i] == 0){
        if(y==0)mycharcont[i].getChildByName('image').image = deadImg;
        if(y==1){
          enemycharcont[i].getChildByName('image').scaleX = 1;
          enemycharcont[i].getChildByName('image').x = width-110;
          enemycharcont[i].getChildByName('image').image = deadImg;

        }
      }else {
        // console.log('vivo');
      }
      if(health[y][i] == player.healths[y][i]){
        dead[y][i] = true;
      }
      if(y==0){
        // mycharcont[i].getChildByName('lifetext').text = health[y][i]+'/100';
        setHealthBar(mycharcont[i],health[y][i],75,0,i);
      }
      if(y==1){
        // enemycharcont[i].getChildByName('lifetext').text= health[y][i]+'/100';
        setHealthBar(enemycharcont[i],health[y][i],75,1,i);

      }

    }
  }

  if(dead[0][0] && dead[0][1] && dead[0][2]
     && dead[1][0] && dead[1][1] && dead[1][2]) {
      animaHealth = false;
      dead[0] = [];
      dead[1] = [];

  }
}
function setHealthBar(bar,health, size,p,i){
  // console.log(bar.x);
  var xis;
  var ypis;
  if(p==0){
    xis = 33;
    ypis = 143+(i*120)+1*i
    textx = 70;
    texty = 154+(i*120)+1*i;
  }
  else {
    xis =(width)-110;
    ypis = 143+(i*120)+1*i;
    textx = width-72;
    texty = 154+(i*120)+1*i;
  }
    var  percentage = health /100;
    var wid = percentage * size;
    if (percentage * 100 > 80)
    {
        var life = new createjs.Shape();
        life.name = 'life';
        life.graphics.beginFill("#3BDF3F").drawRect(xis,ypis,wid,14);
        bar.removeChild(bar.getChildByName('life'));
        bar.addChild(life);

        var lifetxt = new createjs.Text(health+'/100', "12px Franklin", "#151311");
        lifetxt.name = 'lifetext';
        lifetxt.textAlign = 'center';
        lifetxt.x = textx;
        lifetxt.y = texty;
        lifetxt.textBaseline = "alphabetic";

        bar.removeChild(bar.getChildByName('lifetext'));
        bar.addChild(lifetxt);


        return;
    }
    if (percentage * 100 > 40)
    {
        var life = new createjs.Shape();
        life.name = 'life';
        life.graphics.beginFill("#FFCC00").drawRect(xis,ypis,wid,14);
        bar.removeChild(bar.getChildByName('life'));
        bar.addChild(life);
        var lifetxt = new createjs.Text(health+'/100', "12px Franklin", "#151311");
        lifetxt.name = 'lifetext';
        lifetxt.textAlign = 'center';
        lifetxt.x = textx;
        lifetxt.y = texty;
        lifetxt.textBaseline = "alphabetic";

        bar.removeChild(bar.getChildByName('lifetext'));
        bar.addChild(lifetxt);
        return;
    }
    var life = new createjs.Shape();
    life.name = 'life';
    life.graphics.beginFill("#FF0000").drawRect(xis,ypis,wid,14);
    bar.removeChild(bar.getChildByName('life'));
    bar.addChild(life);

    var lifetxt = new createjs.Text(health+'/100', "12px Franklin", "#151311");
    lifetxt.name = 'lifetext';
    lifetxt.textAlign = 'center';
    lifetxt.x = textx;
    lifetxt.y = texty;
    lifetxt.textBaseline = "alphabetic";

    bar.removeChild(bar.getChildByName('lifetext'));
    bar.addChild(lifetxt);
    return;

}
function atualizaturno() {
  // console.log(player.turn);
  if(player.turn == 'PlayerTurn'){
    stage.getChildByName('turncont').getChildByName('turntxt').text = 'PRESS WHEN READY';
    stage.getChildByName('exchange').alpha = 1;
    stage.getChildByName('chakracont').alpha = 1;
    for (var i in mydivskillscont) {
      for (var y = 0; y < 4; y++) {
          mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('skill').alpha = 1;

      }

    }

  }else if(player.turn == 'OpponentTurn'){
    stage.getChildByName('turncont').getChildByName('turntxt').text = 'OPPONENT TURN...';
    stage.getChildByName('exchange').alpha = 0;
    stage.getChildByName('chakracont').alpha = 0;
    for (var i in mydivskillscont) {
      for (var y = 0; y < 4; y++) {
          mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('skill').alpha = 0.3;
      }

    }
  }
  else if(player.turn == 'loser'){
    choose = false;
    chooseEx = false;

    surrender = false;
    stage.getChildByName('turncont').getChildByName('turntxt').text = 'LOSER';
    stage.getChildByName('fImg').visible = true;
    stage.getChildByName('endgame').visible = true;
    stage.getChildByName('endgame').getChildByName('typetext').text = 'LOSER';
    stage.getChildByName('endgame').getChildByName('endimg').image = endlosImg;
    stage.getChildByName('endgame').getChildByName('displaytext').text = player.display.toUpperCase();


  }
  else if(player.turn == 'winner'){
    choose = false;
    chooseEx = false;
    surrender = false;
    stage.getChildByName('turncont').getChildByName('turntxt').text = 'WINNER';
    stage.getChildByName('endgame').getChildByName('typetext').text = 'WINNER';
    stage.getChildByName('endgame').getChildByName('endimg').image = endwinImg;
    stage.getChildByName('endgame').getChildByName('displaytext').text = player.display.toUpperCase();



    stage.getChildByName('fImg').visible = true;
    stage.getChildByName('endgame').visible = true;
  }
  if(player.turn != 'loser' && player.turn != 'winner'){
    validaskill();
    loadminiskills();
  }



}
function createtargetsanima() {
//  console.log(targetevent);
  if(targetevent == null && player.turn == 'PlayerTurn' && targets.length > 0){
    // createjs.Ticker.on("tick", tick2);
    // createjs.Ticker.setFPS(14);
    var targanima = false;
  }

}
  function tick2(){
    // targetevent = evt;
  //  console.log(stage.numChildren);
    // if(battle_status == 'endTurn'){
    if(targets.length == 0){
      // evt.remove();
      for (var i = 0; i < 3; i++) {
        targetsanim[1][i].alpha = 0;
        targetsanim[0][i].alpha = 0;
      }
    }
    for (var i = 0; i < 3; i++) {
      if(targets.indexOf(0+''+i) != -1){
        targetsanim[0][i].alpha = 0.6;
      }else{
        targetsanim[0][i].alpha = 0;
      }
    }
    for (var i = 0; i < 3; i++) {
      if(targets.indexOf(1+''+i) != -1){
        if(targetsanim[1][i].alpha <= 0.1)targanima = true;

        if(targetsanim[1][i].alpha > 0.1 && targanima == false){
          targetsanim[1][i].alpha-= 0.05;
        }
        else{
          if(targetsanim[1][i].alpha == 0.6)targanima = false;
          else targetsanim[1][i].alpha+= 0.05;


        }
      }else{
        targetsanim[1][i].alpha = 0;
      }
    }


    // stage.update();
  }
createtargetsanima();
socket.on('endturn',function(data){
  endt = true;
  player = data;
  // player.energy[0] = 1000;
  // player.energy[1] = 1000;
  // player.energy[2] = 1000;
  // player.energy[3] = 1000;
  // player.energy[4] = 4000;
  if(player.turn == 'PlayerTurn'){
    load_b = true;
    newCursor.image = shuri;
    newCursor.regX = newCursor.regY = 35;
  }

  queuef2 = [];
  if(player.turn != 'loser' && player.turn != 'winner'){

    for (var i = 0; i < 3; i++) {
      enemyskilleffectcont[i] = 0;
      myskilleffectcont[i] = 0;
      for (var y = 0; y < 9; y++) {
        enemyskilleffect[i][y].alpha = 0;
        myskilleffect[i][y].alpha = 0;
      }
      for ( y = 0; y < 4; y++) {
        mydivskillscont[i].getChildByName('skillcont'+y).x = mydivskillscont[i].getChildByName('skillcont'+y).old_x;

      }

    }
  }
  if(player.queue.length > 0){
    for (var i = 0; i < player.queue.length; i++) {
      queuef2.push(player.queue[i]);
    }
  }
  // console.log(queuef2);

  // console.log(player);
  // load_b = false;
  clearInterval(int_timer);

  if(player.turn != 'loser' && player.turn != 'winner'){
    createTimer();
    anima = true;
    animaHealth = true;
  }

  atualizaturno();


});
function EndTurn(){
  choose = false;
  chooseEx = false;
  surrender = false;
  ex_char[0] = 0;
  ex_char[1] = 0;
  ex_char[2] = 0;
  ex_char[3] = 0;
  cho_ex[0] = 0;
  cho_ex[1] = 0;
  var_sel_ex = null;
  var_ex = false;
  stage.getChildByName('fImg').visible = false;


  if(player.turn == 'PlayerTurn' && anima == false){
    var data = [];
    data[0] = queueend;
    data[1] = player.energy;
    stage.getChildByName('turncont').getChildByName('turntxt').text = 'CALCULATING...';

    socket.emit('endturn',data);

    battle_status = 'endTurn';


    // queueend = queuef2.slice();
    // console.log('EndTurn',queueend,player.energy);
    load_b = true;
    newCursor.image = shuri;
    newCursor.regX = newCursor.regY = 35;
    targets = [];
    skillAct[0] = {};
    skillAct[1] = {};
    skillAct[2] = {};
    queuef = [];
    queuef2 = [];
    queueend = [];

  }
}

function endT(newpo) {
  for (var i in mydivskillscont) {
    if (mydivskillscont[i].x - 5 < newpo || mydivskillscont[i].x - 5 > newpo)
    {
        pos_diff = newpo - mydivskillscont[i].x;
        mydivskillscont[i].x = mydivskillscont[i].x + pos_diff / 2.2;
    }
    if(mydivskillscont[i].x >= newpo){
      if(mydivskillscont[i].x - newpo < 1)mydivskillscont[i].x = newpo;
    }else {
      if(newpo - mydivskillscont[i].x  < 1)mydivskillscont[i].x = newpo;

    }
  }
  if(player.turn == 'OpponentTurn'){
    if(mydivskillscont[0].x == -3){
      // evt.remove();
      anima = false;

      // player.turn = 'OpponentTurn'
    }
  }else{
    if(mydivskillscont[0].x == 75){
      // evt.remove();
      anima = false;

      // player.turn = 'PlayerTurn';
    }
  }

  // stage.update();

  // console.log(mydivskillscont[0].x);
}

function selectHere(p,c) {
  if(targets.length > 0){
      //console.log(targets);
      //console.log(choice);
      // if((targets.indexOf(p+''+c) != -1  || choice.indexOf(p+''+c) != -1)){
      if((choice.indexOf(p+''+c) != -1) || (choice.length == 0 && targets.indexOf(p+''+c) != -1)){
          selectTarget(p,c);
          return;

      }
  }

  selectChar(p,c);




}

function selectChar(p,c){
  targets = [];
  choice = [];
  infocont.getChildByName('infoimgcont').getChildByName('imagecont').image = charimages[p][c];
  infocont.getChildByName('infoname').text = player[p][c].name.toUpperCase();
  infocont.getChildByName('energycont').alpha = 0;
  infocont.getChildByName('infoclasslist').alpha = 0;
  infocont.getChildByName('infocooldown').alpha = 0;
  infocont.getChildByName('infodesc').text = player[p][c].description.toUpperCase();
  infocont.getChildByName('infoclan').alpha = 0;
  infocont.getChildByName('infolevel').alpha = 0;
  infocont.getChildByName('infoladder').alpha = 0;
  infocont.getChildByName('infoladder').alpha = 0;
  infocont.getChildByName('inforatio').alpha = 0;

  for (var i = 0; i < 3; i++) {
    infocont.getChildByName('infoteamcont'+i).alpha = 0;
  }
  // stage.update();
  // console.log(stage.numChildren);
}

function attchakras() {
  for (var i = 0; i < 5; i++) {
    stage.getChildByName('chakracont').getChildByName('chakra_'+i).text = 'x '+player.energy[i];

  }
}

function selectTarget(p,c){
  // console.log(targets.indexOf(queueaux.c));
  skillAct[queueaux.c[1]].c = true;
  skillAct[queueaux.c[1]].s = queueaux.s;

  if(choice.length != 0)queuef.push({character_id: queueaux.character_id,c: queueaux.c, t: ""+p+""+c+"", s:queueaux.s, a: null,skill:queueaux.skill});
  queuef2.push({character_id: queueaux.character_id,c: queueaux.c, t: ""+p+""+c+"", s:queueaux.s, a: null,skill:queueaux.skill});

  if(targets.length > choice.length && choice.length > 0 && p != 0 && targets.indexOf(queueaux.c) != -1){
    // console.log('entrou desenha');
    queuef.push({character_id: queueaux.character_id,c: queueaux.c, t: queueaux.c, s:queueaux.s, a: null,skill:queueaux.skill});
  }
  if(choice.length == 0){
    for (var i = 0; i < targets.length; i++) {
      queuef.push({character_id: queueaux.character_id,c: queueaux.c, t: targets[i], s:queueaux.s, a: null,skill:queueaux.skill});
    }
  }
  var newch = player[0][queueaux.c[1]][queueaux.s].energy;
  for(w in newch){
    // console.log('My S ',newch[w]);
    // console.log('My C ',player.energy[w]);
    player.energy[w] -= newch[w];
    if(w != 4)player.energy[4] -= newch[w];
  }
  //console.log(queuef);
  targets = [];
  choice = [];

  animaskill = true;
  loadminiskills();
  validaskill();


}
function dbmini(event) {
    //console.log('Touch '+touchtime);
    dbclick(event);
}
function loadminiskills() {
  //console.log('ent');
  for (var i = 0; i < 3; i++) {
    enemyskilleffectcont[i] = 0;
    myskilleffectcont[i] = 0;
    for (var y = 0; y < 9; y++) {
      myskilleffect[i][y].removeEventListener("click", dbmini);
      enemyskilleffect[i][y].removeEventListener("click", dbmini);
      enemyskilleffect[i][y].alpha = 0;
      myskilleffect[i][y].alpha = 0;
    }
  }
  loadEffects();

  for (var i = 0; i<queuef.length;i++) {
    var t = queuef[i].t[1];
    if(queuef[i].t[0] == 1){
      enemyskilleffect[t][enemyskilleffectcont[t]].alpha = 1;
      enemyskilleffect[t][enemyskilleffectcont[t]].no_over = true;
      enemyskilleffect[t][enemyskilleffectcont[t]].c = queuef[i].c[1];
      enemyskilleffect[t][enemyskilleffectcont[t]].p = queuef[i].c[0];
      enemyskilleffect[t][enemyskilleffectcont[t]].s = queuef[i].s;

      enemyskilleffect[t][enemyskilleffectcont[t]].addEventListener("click",dbmini);
      enemyskilleffect[t][enemyskilleffectcont[t]].getChildByName('skill').image = skillsimages[queuef[i].character_id][queuef[i].skill];
      enemyskilleffectcont[t]++
    }else{
      myskilleffect[t][myskilleffectcont[t]].alpha = 1;
      myskilleffect[t][myskilleffectcont[t]].no_over = true;
      myskilleffect[t][myskilleffectcont[t]].c = queuef[i].c[1];
      myskilleffect[t][myskilleffectcont[t]].p = queuef[i].c[0];
      myskilleffect[t][myskilleffectcont[t]].s = queuef[i].s;
      myskilleffect[t][myskilleffectcont[t]].addEventListener("click",dbmini);
      // console.log(queuef[i].character_id,queuef[i].skill);
      myskilleffect[t][myskilleffectcont[t]].getChildByName('skill').image = skillsimages[queuef[i].character_id][queuef[i].skill];
      myskilleffectcont[t]++
    }
  }
}


function animauseskill() {
  // createjs.Ticker.on("tick", tick);
  // createjs.Ticker.setFPS(14);
  // var pos_diff;
  var newpo = 53;
  var sk = mydivskillscont[queueaux.c[1]].getChildByName('skillcont'+queueaux.s);
  if (sk.x - 5 > newpo ||sk.x - 5 < newpo )
  {
      pos_diff = newpo - sk.x;
      sk.x = sk.x + pos_diff / 2;
  }
  if(sk.x >= newpo){
      if(sk.x - newpo < 1)sk.x = newpo;
  }else {
    if(newpo - sk.x  < 1)sk.x = newpo;

  }
  if(sk.x <= newpo)animaskill = false;
    // console.log(stage.numChildren);
    // stage.update();

}

function useSkill(c,s){
  var newch = player[0][c][s].energy;

  var myenergy = newch[0]+newch[1]+newch[2]+newch[3]+newch[4];
//  //console.log(myenergy,random);
  var random = player.energy[4];
  if(player.turn == 'OpponentTurn'){
    // console.log('if 1');

    return true;
  }
  if(myenergy > random){
    // console.log('if 2');

    return true;
  }
  for(k in newch){
    if(k == 4){
      if(player[0][c][s].energy[k] > random){
        // console.log('if 3');

        return true;
      }
    }
    else if(newch[k] > player.energy[k]){
      // console.log('if 4');

      return true;
    }
  }

  if((player.target[c][s].t.length == 0) || skillAct[c].c == true || player.target[c][s].cooldown > 0 ){
    // console.log('if 5 ');

    return true;
  }
  // console.log('if 6');

  return false;

}

function validaskill() {

  for (var i = 0; i < 3; i++) {
    for ( y = 0; y < 4; y++) {
      if(useSkill(i,y)){
        if(player.turn == 'PlayerTurn' && player.target[i][y].cooldown > 0 ){
          mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('cool').alpha = 1;
          mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('cool').text = player.target[i][y].cooldown;
        }if(player.turn == 'OpponentTurn'){
          mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('cool').alpha = 0;
        }
        if(skillAct[i].s != y)mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('skill').alpha = 0.3;
        mydivskillscont[i].getChildByName('skillcont'+y).skill_id = player[0][i][y].skill_id;
        mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('skill').image = skillsimages[player[0][i].character_id][player[0][i][y].skill_id];
      }else{
        // mydivskillscont[i].getChildByName('skillcont'+y).c = player[0][i].character_id;
        mydivskillscont[i].getChildByName('skillcont'+y).skill_id = player[0][i][y].skill_id;
        mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('skill').image = skillsimages[player[0][i].character_id][player[0][i][y].skill_id];
        mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('skill').alpha = 1;
        mydivskillscont[i].getChildByName('skillcont'+y).getChildByName('cool').alpha = 0;

      }
    }

  }
}

function desSkill(event){
  var skin = event.currentTarget;
  if(skillAct[skin.c].c){
    for (var i = 0; i<queuef2.length;i++) {
      if(queuef2[i].c ==  skin.p+''+skin.c && queuef2[i].s == skin.s){
        queuef2.splice(i,1);
      }
    }
    for (var i = 0; i<queuef.length;i++) {
      if(queuef[i].c ==  skin.p+''+skin.c && queuef[i].s == skin.s){
        queuef.splice(i,1);
        i--;
        if(skillAct[skin.c].c){
          var newch = player[0][skin.c][skin.s].energy;

          for(w in newch){
            player.energy[w] += newch[w];
            if(w != 4)player.energy[4] += newch[w];
          }
        }

        skillAct[skin.c] = {};
        mydivskillscont[skin.c].getChildByName('skillcont'+skin.s).x = mydivskillscont[skin.c].getChildByName('skillcont'+skin.s).old_x;
        //console.log('DBCLICK ',skillAct);

        // break;
      }
    }
    // queuef = [];
    loadminiskills();

    validaskill();
    // stage.update();
  }
}
function dbclick(i){
  targets = [];
  choice = [];
  if (touchtime == 0) {
      // set first click
      touchtime = new Date().getTime();

  } else {
      // compare first click to this click and see if they occurred within double click threshold
      if (((new Date().getTime()) - touchtime) < 800) {
          // double click occurred
          touchtime = 0;
          desSkill(i);
      } else {
          // not a double click so set as a new first click
          touchtime = new Date().getTime();
      }
  }
}


var newCursor = new createjs.Bitmap();

function createcursor() {
  stage.addEventListener('stagemousedown', function(ev) {
    if(!load_b)newCursor.image = kunai2;
  });
  stage.addEventListener('stagemouseup', function(ev) {
    if(!load_b)newCursor.image = kunai1;
  });
  stage.cursor = 'none';
  //
  newCursor.image = kunai1;
  newCursor.x = stage.mouseX;
  newCursor.y = stage.mouseY;
  //
  // console.log('ne');
  stage.addChild(newCursor);
  //
  createjs.Ticker.setFPS(14);

  createjs.Ticker.on("tick", function () {

    if(load_b){
      newCursor.rotation+=30;
    }
  attchakras();
  chooseAtt();
  exAtt();
  surrenderAtt();
  unableAtt();
  lostAtt();
  tick2();

  if(anima){
    if(player.turn == 'PlayerTurn')var newpo = 75;
    else var newpo = -3;
    endT(newpo);
  }
  if(animaHealth){
    attHealth();
  }
  if(animaskill){
    animauseskill();
  }

    // stage.cursor = 'none';

    newCursor.x = stage.mouseX;
    newCursor.y = stage.mouseY;
    stage.update();
  });



}

var int_timer = null;
var int_checking = null;
var timer = 191;
var count = 0;
function createTimer(){
  timer = 191;
  count  = 0;
  clearInterval(int_timer);
  clearInterval(int_checking);


  int_timer = setInterval(function () {
      //console.log(count);
       timer -= 3.183333333;
       count++;
       if(count == 1){
         load_b = false;
         newCursor.regX = newCursor.regY = 0;
         newCursor.rotation = 0;

         newCursor.image = kunai1;
       }
       if(count >= 60){
         count  = 0;
         // timer = 191;
         clearInterval(int_timer);

         if(player.turn == 'PlayerTurn' && count == 60){
           EndTurn()
           // console.log('END TIME');
         }else if(player.turn == 'OpponentTurn') {
           stage.getChildByName('turncont').getChildByName('turntxt').text = 'CHECKING OPPONENT...';
           int_checking = setInterval(function () {
             count++;
             if(count == 61){
               socket.emit('connectbattle','getTurn');
               clearInterval(int_checking);
             }
           }, 1000);

         }
       }
       var life = new createjs.Shape();
       life.name = 'life';
       life.graphics.beginFill("#ba1921").drawRect(-96,18,timer,10);
       turncont.removeChild(turncont.getChildByName('life'));
       turncont.addChild(life);
       // turncont.getChildByName('life').remove();
      // //console.log("TIME",count);
   }, 1000);
}
function createEndgame(){
  var cont = new createjs.Container();
  cont.name = 'endgame';

  var ch = new createjs.Bitmap();
  ch.image = fImg;
  ch.alpha = 0.3;
  ch.name = 'fImg';
  ch.visible = false;


  stage.addChild(ch);


  var ch = new createjs.Bitmap();
  ch.image = endgameImg;
  ch.name = 'endGameimg';
  cont.x = 65;
  cont.y = 110;
  cont.addChild(ch);



  ch = new createjs.Bitmap();
  ch.image = endwinImg;
  ch.name = 'endimg';
  ch.x = 82;
  ch.y = 48;

  cont.addChild(ch);

  var endtext = new createjs.Text('CONTINUE', "25px Franklin", "#ba1a22");
  endtext.name = 'conttext';
  endtext.x = 480;
  endtext.y = 273;
  endtext.textBaseline = "alphabetic";
  endtext.textAlign = 'center';
  endtext.addEventListener('click',function () {
    window.location = "/selection";
  });
  cont.addChild(endtext);

 var endtext = new createjs.Text('WINNER', "45px Franklin", "#ba1a22");
 endtext.name = 'typetext';
 endtext.x = 480;
 endtext.y = 74;
 endtext.textBaseline = "alphabetic";

 endtext.textAlign = 'center';
 cont.addChild(endtext);

 var endtext = new createjs.Text('', "13px Franklin", "#151311");
 endtext.name = 'displaytext';
 endtext.x = 345;
 endtext.lineHeight = 15;
 endtext.lineWidth = 270;
 endtext.y = 95;
 endtext.textAlign = 'left';
 endtext.textBaseline = "alphabetic";

 cont.addChild(endtext);

 cont.visible = false;
 stage.addChild(cont);


}
var surrender = false;
function createsurrender() {
  var cont = new createjs.Container();
  cont.name = 'contsurrender';
  var ch = new createjs.Bitmap();
  ch.image = chooseImg;
  ch.name = 'chooser';
  ch.x = 205;
  ch.y = 100;

  var chimage = new createjs.Bitmap();
  chimage.image = surrenderMImg;
  chimage.name = 'chooserimg';
  chimage.x = 320;
  chimage.y = 170;




  var okI = new createjs.Bitmap();
  okI.image = okImg;
  okI.name = 'ok';
  okI.x = 305;
  okI.y = 315;
  okI.addEventListener('click', function(event) {
    socket.emit('surrender');
  });


  var cancelI = new createjs.Bitmap();
  cancelI.image = cancelImg;
  cancelI.name = 'cancel';
  cancelI.x = 440;
  cancelI.y = 315;

  cancelI.addEventListener('click', function(event) {
    surrender = false;
    stage.getChildByName('fImg').visible = false;
  });
  // ch.alpha = 0;
  cont.addChild(ch);
  cont.addChild(okI);
  cont.addChild(cancelI);
  cont.addChild(chimage);
  var choosetxt = new createjs.Text('ARE YOU SURE YOU WISH TO SURRENDER?', "16px Franklin", "#151311");
  choosetxt.x = 420;
  choosetxt.y = 154;
  choosetxt.textAlign = 'center';
  choosetxt.name = 'surrendertext';
  choosetxt.textBaseline = "alphabetic";

  cont.addChild(choosetxt);

  cont.alpha = 0;
  stage.addChild(cont);
}
function createunable() {
  var cont = new createjs.Container();
  cont.name = 'contunable';
  var ch = new createjs.Bitmap();
  ch.image = chooseImg;
  ch.name = 'chooser';
  ch.x = 205;
  ch.y = 100;

  var choosetxt = new createjs.Text('YOU ARE UNABLE TO EXCHANGE CHAKRA.\nYOU DO NOT HAVE ENOUGH CHAKRA.\nFIVE RANDOM CHAKRA CAN BE EXCHANGED FOR ONE CHAKRA OF THE TYPE OF YOUR CHOICE', "16px Franklin", "#151311");
  choosetxt.x = 420;
  choosetxt.y = 204;
  choosetxt.textAlign = 'center';
  choosetxt.lineWidth = 300;
  choosetxt.name = 'unebletxt';
  choosetxt.textBaseline = "alphabetic";

  var okI = new createjs.Bitmap();
  okI.image = okImg;
  okI.name = 'ok';
  okI.x = 380;
  okI.y = 315;
  okI.addEventListener('click', function(event) {
    unable = false;
    stage.getChildByName('fImg').visible = false;
  });
  cont.addChild(ch);
  cont.addChild(choosetxt);

  cont.addChild(okI);



  // cont.alpha = 1;
  stage.addChild(cont);
}
function createconlost() {
  var cont = new createjs.Container();
  cont.name = 'contlost';
  var ch = new createjs.Bitmap();
  ch.image = chooseImg;
  ch.name = 'chooser';
  ch.x = 205;
  ch.y = 100;

  var choosetxt = new createjs.Text('', "16px Franklin", "#151311");
  choosetxt.x = 420;
  choosetxt.text = "reconnecting please wait, or click OK to refresh the page...".toUpperCase();
  choosetxt.y = 184;
  choosetxt.textAlign = 'center';
  choosetxt.lineWidth = 300;
  choosetxt.lineHeight = 16;
  choosetxt.name = 'losttxt';
  choosetxt.textBaseline = "alphabetic";

  var okI = new createjs.Bitmap();
  okI.image = okImg;
  okI.name = 'ok';
  okI.x = 380;
  okI.y = 315;
  okI.addEventListener('click', function(event) {
    window.location = "/battle";
  });
  cont.addChild(ch);
  cont.addChild(choosetxt);

  cont.addChild(okI);

  stage.addChild(cont);
}

function createchoose(){
  var cont = new createjs.Container();
  cont.name = 'contchoose';
  var ch = new createjs.Bitmap();
  ch.image = chooserImg;
  ch.name = 'chooser';
  ch.x = 205;
  ch.y = 100;




  var okI = new createjs.Bitmap();
  okI.image = okImg;
  okI.name = 'ok';
  okI.x = 305;
  okI.y = 315;
  okI.addEventListener('click', function(event) {
    chooseOk();
  });


  var cancelI = new createjs.Bitmap();
  cancelI.image = cancelImg;
  cancelI.name = 'cancel';
  cancelI.x = 440;
  cancelI.y = 315;

  cancelI.addEventListener('click', function(event) {
    chooseCancel();
  });
  // ch.alpha = 0;
  cont.addChild(ch);
  cont.addChild(okI);
  cont.addChild(cancelI);
  var choosetxt = new createjs.Text('2', "16px Franklin", "#fe1d19");
  choosetxt.x = 388;
  choosetxt.y = 158;
  choosetxt.textBaseline = "alphabetic";

  choosetxt.name = 'chooserandom';

  cont.addChild(choosetxt);

  for (var i = 0; i < 6; i++) {
    var skilleffect = new createjs.Bitmap();
    // skilleffect.image = skillsimages[0][0];
    skilleffect.name = 'skill';
    skilleffect.scaleX = 0.47;
    skilleffect.scaleY = 0.47;
    var shape = new createjs.Shape();
    shape.name = 'borda';
    shape.graphics.beginStroke("#000");
    shape.graphics.setStrokeStyle(1);
    shape.snapToPixel = true;
    shape.graphics.drawRect(0, 0, 36, 36);
    shape.x = skilleffect.x - 0.5;
    shape.y = skilleffect.y - 0.5;
    skilleffect.mask = shape;
    var cont2 = new createjs.Container();
    cont2.name = 'skilleffectcont'+i;
    cont2.x = 293+(i*43);
    cont2.y = 273;
    cont2.addChild(shape);
    cont2.addChild(skilleffect);


    cont2.alpha = 0;


    cont2.i = i;

    cont2.pos = i;

    cont2.old_x = cont2.x ;
    cont2.drag = false;

    cont2.on("pressmove", function(evt){
      var targ = evt.currentTarget;
      if(targ.drag == false){
        targ.x -= 4;
        targ.y -= 4;
        targ.scaleX = 1.2;
        targ.scaleY = 1.2;

        // stage.setChildIndex(targ,stage.numChildren-1);

      }
      targ.drag = true;

      if( evt.stageX > 280 - 43 && evt.stageX < 555) targ.x = evt.stageX;
      // stage.update();

    });
    cont2.on("pressup", function(evt) {
      var targ = evt.currentTarget;
      if(targ.drag){
        targ.drag = false;
        targ.scaleX = 1;
        targ.scaleY = 1;
        targ.x += 4;
        targ.y += 4;
      }


      var pos = targ.pos;
      // console.log(targ.old_x,targ.x);
      if(targ.old_x < targ.x){
        for (var i = 0; i < queuef2.length; i++) {

          if(targ.x > 293+(i*43)+36){
            pos = i;
          }
        }
      }else if (targ.old_x > targ.x) {
        for (var i = 0; i < queuef2.length; i++) {
          if(targ.x < 293+((queuef2.length-1)*43) - (i*43) - 36){
            pos = (queuef2.length-1)-i;
          }
        }
      }

      targ.pos = pos;
      if(targ.i <= pos){
        for (var i = targ.i; i <= targ.pos; i++) {
          var newtar = stage.getChildByName('contchoose').getChildByName('skilleffectcont'+i);
          if(newtar != targ){
            newtar.pos--;
            newtar.i = newtar.pos;
            newtar.name = 'skilleffectcont'+newtar.pos;
          }

        }
      }else {
        for (var i = targ.i; i >= targ.pos; i--) {
          var newtar = stage.getChildByName('contchoose').getChildByName('skilleffectcont'+i);

          if(newtar != targ){
            newtar.pos++;
            newtar.i = newtar.pos;
            newtar.name = 'skilleffectcont'+newtar.pos;
          }

        }
      }

      targ.name = 'skilleffectcont'+pos;
      targ.i = pos;
      for (var i = 0; i < queuef2.length; i++) {
        var newtar = stage.getChildByName('contchoose').getChildByName('skilleffectcont'+i);
        newtar.x = 293+(newtar.pos*43);
        newtar.old_x = newtar.x ;
        queuef2[i] = newtar.queue;


      }
      // stage.update();

    });

    cont.addChild(cont2);

  }

  for (var i = 0; i < 4; i++) {
    choosetxt = new createjs.Text('2', "14px Franklin", "#000");
    choosetxt.x = 375;
    choosetxt.y = 198+(19*i);
    choosetxt.name = 'choosetxt'+i;
    choosetxt.textBaseline = "alphabetic";
    cont.addChild(choosetxt);
    choosetxt = new createjs.Text('2', "14px Franklin", "#000");
    choosetxt.x = 547;
    choosetxt.y = 198+(19*i);
    choosetxt.textBaseline = "alphabetic";

    choosetxt.name = 'choosertxt'+i;

    var choosemais = new createjs.Bitmap();
    choosemais.image = mais;
    choosemais.name = 'mais'+i;
    choosemais.i = i;
    choosemais.x = 430;
    choosemais.y = 188+(19*i);
    choosemais.addEventListener('click', function(event) {
      choosePlus(event.currentTarget.i);
    });


    var choosemenos = new createjs.Bitmap();
    choosemenos.image = menos;
    choosemenos.name = 'menos'+i;
    choosemenos.x = 410;
    choosemenos.i = i;
    choosemenos.y = 188+(19*i);
    choosemenos.addEventListener('click', function(event) {
      chooseMin(event.currentTarget.i);
    });



    cont.addChild(choosetxt);
    cont.addChild(choosemenos);
    cont.addChild(choosemais);
  }
  cont.alpha = 0;
  stage.addChild(cont);



}
function createexchange(){
  var cont = new createjs.Container();
  cont.name = 'contexchange';
  var ch = new createjs.Bitmap();
  ch.image = exchangeImg;
  ch.name = 'exchange';
  ch.x = 205;
  ch.y = 100;




  var okI = new createjs.Bitmap();
    okI.image = okImg;
    okI.name = 'ok';
    okI.x = 305;
    okI.y = 315;
    okI.addEventListener('click', function(event) {
      exOk();
    });


    var cancelI = new createjs.Bitmap();
    cancelI.image = cancelImg;
    cancelI.name = 'cancel';
    cancelI.x = 440;
    cancelI.y = 315;

    cancelI.addEventListener('click', function(event) {
      exCancel();
    });
    // ch.alpha = 0;
    cont.addChild(ch);
    cont.addChild(okI);
    cont.addChild(cancelI);

    var choosetxt = new createjs.Text('CHOOSE YOUR NEW CHAKRA', "16px Franklin", "#000");
    choosetxt.x = 340;
    choosetxt.y = 150;
    choosetxt.textBaseline = "alphabetic";

    choosetxt.name = 'choosenewchakra';

    cont.addChild(choosetxt);

    for (var i = 0; i < 4; i++) {
      var chak = new createjs.Bitmap();
      chak.image = chakras[i];
      chak.name = 'chak'+i;
      chak.x = 390+(i*20);
      chak.y = 160;
      chak.alpha = 0.5;
      chak.i = i;
      chak.addEventListener('click', function(event) {
        toputo(event.currentTarget.i);
      });
      cont.addChild(chak);


    }

    var choosetxt = new createjs.Text('2', "16px Franklin", "#fe1d19");
    choosetxt.x = 388;
    choosetxt.y = 192;
    choosetxt.textBaseline = "alphabetic";

    choosetxt.name = 'chooserandom';

    cont.addChild(choosetxt);

    for (var i = 0; i < 4; i++) {
      choosetxt = new createjs.Text('2', "14px Franklin", "#000");
      choosetxt.x = 375;
      choosetxt.y = 232+(19*i);
      choosetxt.name = 'choosetxt'+i;
      choosetxt.textBaseline = "alphabetic";
      cont.addChild(choosetxt);
      choosetxt = new createjs.Text('2', "14px Franklin", "#000");
      choosetxt.x = 547;
      choosetxt.y = 232+(19*i);
      choosetxt.textBaseline = "alphabetic";

      choosetxt.name = 'choosertxt'+i;

      var choosemais = new createjs.Bitmap();
      choosemais.image = mais;
      choosemais.name = 'mais'+i;
      choosemais.i = i;
      choosemais.x = 430;
      choosemais.y = 222+(19*i);
      choosemais.addEventListener('click', function(event) {
        choosePlusex(event.currentTarget.i);
      });


      var choosemenos = new createjs.Bitmap();
      choosemenos.image = menos;
      choosemenos.name = 'menos'+i;
      choosemenos.x = 410;
      choosemenos.i = i;
      choosemenos.y = 222+(19*i);
      choosemenos.addEventListener('click', function(event) {
        chooseMinex(event.currentTarget.i);
      });



      cont.addChild(choosetxt);
      cont.addChild(choosemenos);
      cont.addChild(choosemais);
    }
    // cont.alpha = 0;
    stage.addChild(cont);



}

function chooseChakra(){
  var ch = stage.getChildByName('contchoose');

  for (var i = 0; i < 6; i++) {
    ch.getChildByName('skilleffectcont'+i).alpha = 0;
  }

  chooseC[0] = player.energy[0];
  chooseC[1] = player.energy[1];
  chooseC[2] = player.energy[2];
  chooseC[3] = player.energy[3];

  chooseC[4] = -1 * (parseInt(player.energy[4]) - (parseInt(player.energy[0])+parseInt(player.energy[1])+parseInt(player.energy[2])+parseInt(player.energy[3])));
  // console.log('choose c'+   (player.energy[0]+player.energy[1]+player.energy[2]+player.energy[3] );
  chooseE[0] = 0;
  chooseE[1] = 0;
  chooseE[2] = 0;
  chooseE[3] = 0;
  if(chooseC[4] == 0 && queuef2.length <= 1){
    chooseOk();
  }else{
    choose = true;
    stage.getChildByName('fImg').visible = true;

  }

}
function chooseMin(i){
  if(chooseE[i] > 0){
    chooseC[4]++;
    chooseC[i]++;
    chooseE[i]--;
  }

}
function choosePlus(i){
  if(chooseC[4] > 0 && chooseC[i] > 0){
    chooseC[4]--;
    chooseC[i]--;
    chooseE[i]++;
  }

}
function chooseOk(){
  if(chooseC[4] == 0){
    for(i = 0; i< 4 ; i++){
      player.energy[i] -= chooseE[i];
    }
    player.energy[4] = 0;
    for(i = 0; i< 4 ; i++){
      player.energy[4] += player.energy[i];
    }

    queueend = queuef2.slice();

    EndTurn();
    choose = false;
    stage.getChildByName('fImg').visible = false;

  }

}
function chooseChakraEx(){
  if (player.energy[4] < 5 && var_sel_ex == null)
  {
    unable = true;
    stage.getChildByName('fImg').visible = true;

    return;
  }else{
    my_ex = player.energy.slice();
    auxcho_ex = cho_ex.slice();
    auxex_char = ex_char.slice();
    auxvar_sel_ex = var_sel_ex;
    chooseEx = true;
    stage.getChildByName('fImg').visible = true;

  }
}
function toputo(i){
  if(var_sel_ex == null){
    cho_ex[1] = 5;
    var_ex = false;

    var_sel_ex =  i;
  }else if(var_sel_ex == i){
    if(cho_ex[0]==1){
      my_ex[var_sel_ex]--;
      cho_ex[0] = 0;
    }
    var_ex = false;
    var_sel_ex = null;
    cho_ex[1] = 0;
    my_ex[0] = parseInt(my_ex[0]) + parseInt(ex_char[0]);
    my_ex[1] = parseInt(my_ex[1]) + parseInt(ex_char[1]);
    my_ex[2] = parseInt(my_ex[2]) + parseInt(ex_char[2]);
    my_ex[3] = parseInt(my_ex[3]) + parseInt(ex_char[3]);

    ex_char[0] = 0;
    ex_char[1] = 0;
    ex_char[2] = 0;
    ex_char[3] = 0;
  }

}
function chooseMinex(i){
  if(ex_char[i] > 0 && var_sel_ex != null){
    my_ex[i]++;
    ex_char[i]--;
    cho_ex[1]++;

  }
}
function choosePlusex(i){
  if(cho_ex[1] > 0 && my_ex[i] > 0  && var_sel_ex != null){
    my_ex[i]--;
    ex_char[i]++;
    cho_ex[1]--;

  }
}
function exOk(){
  if(cho_ex[1] == 0 && var_ex == false){
    var_ex = true;
    if(ex_char[0]+ex_char[1]+ex_char[2]+ex_char[3]==5)cho_ex[0] = 1;
    player.energy = my_ex.slice();
    player.energy[var_sel_ex]++;
    var random = parseInt(player.energy[3])+parseInt(player.energy[2])+parseInt(player.energy[1])+parseInt(player.energy[0]);
    player.energy[4] = random;
    chooseEx = false;
    stage.getChildByName('fImg').visible = false;
    validaskill();
  }
}
function exCancel(){
  cho_ex  = auxcho_ex.slice();
  ex_char  = auxex_char.slice();
  var_sel_ex  = auxvar_sel_ex;
  chooseEx = false;
  stage.getChildByName('fImg').visible = false;

}
function chooseCancel(){
  choose = false;
  stage.getChildByName('fImg').visible = false;
  endt = true;



}
function surrenderAtt() {
  var ch = stage.getChildByName('contsurrender');
  if(surrender){
    ch.alpha = 1;
  }else{
    if(ch.alpha == 1)ch.alpha = 0;
  }
}
function unableAtt() {
  var ch = stage.getChildByName('contunable');
  if(unable){
    ch.alpha = 1;
  }else{
    if(ch.alpha == 1)ch.alpha = 0;
  }
}
function lostAtt() {
  var ch = stage.getChildByName('contlost');
  if(connection_lost){
    ch.alpha = 1;
  }else{
    if(ch.alpha == 1)ch.alpha = 0;
  }
}

function exAtt() {
  var ch = stage.getChildByName('contexchange');

  if(chooseEx){
    ch.alpha = 1;
    ch.getChildByName('chooserandom').text = cho_ex[1];
    for (var i = 0; i < 4; i++) {
      ch.getChildByName('choosetxt'+i).text = my_ex[i];
      ch.getChildByName('choosertxt'+i).text = ex_char[i];
    }

    for (var i = 0; i < 4; i++) {
      if(var_sel_ex == i)ch.getChildByName('chak'+i).alpha = 1;
      else ch.getChildByName('chak'+i).alpha = 0.5;
    }

  }else{
    if(ch.alpha == 1)ch.alpha = 0;
  }

}
var skillQ = true;
function chooseAtt() {
  var ch = stage.getChildByName('contchoose');
  if(choose){
    ch.alpha = 1;
    ch.getChildByName('chooserandom').text = chooseC[4];
    for (var i = 0; i < 4; i++) {
      ch.getChildByName('choosetxt'+i).text = chooseC[i];
      ch.getChildByName('choosertxt'+i).text = chooseE[i];
    }
    if(skillQ){
      for (var i = 0; i < queuef2.length; i++) {
        ch.getChildByName('skilleffectcont'+i).alpha = 1;
        ch.getChildByName('skilleffectcont'+i).queue = queuef2[i];
        ch.getChildByName('skilleffectcont'+i).getChildByName('skill').image = skillsimages[queuef2[i].character_id][queuef2[i].skill];
      }
      skillQ = false;
    }

  }else{
    if(ch.alpha == 1)ch.alpha = 0;
    skillQ = true;
  }
}

function createDes() {
  var cont = new createjs.Container();
  cont.name = 'contdescskill';
  cont.x = 155;
  cont.y = 100;
  var descriptionSkill = new createjs.Bitmap();
  descriptionSkill.name = 'descriptionSkill';

  descriptionSkill.image = descImg;

  var shape = new createjs.Shape();
  shape.name = 'borda';
  shape.graphics.beginStroke("#000");
  shape.graphics.drawRect(0, 0, 0, 0);
  shape.x = descriptionSkill.x - 0.5;
  shape.y = descriptionSkill.y - 0.5;
  descriptionSkill.mask = shape;
  var conttext = new createjs.Container();
  conttext.name = 'conttext';
  conttext.x = 5;
  conttext.y = 15;



  cont.addChild(shape);
  cont.addChild(descriptionSkill);
  cont.addChild(conttext);
  cont.alpha = 0;
  stage.addChild(cont);
}

});
