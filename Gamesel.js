$(function(){

var stage = new createjs.Stage("mycanvas");
// stage.webkitImageSmoothingEnabled = stage.mozImageSmoothingEnabled = true;

var width  = 770;
var height = 560;
var select_c = -1;
var select_i = -1;
var select_s = -1;
var pergopen = false;
var per;
var slade;
var pagActual = 0;
var touchtime2  = [];
var newpo = 680;
var animSha = false;
var contselected = 3;
var chakras = [];
const token = localStorage.jwtToken;
var socket = io({query: {token: token}});
var player;
var loading = true;
var int_search = null;
var connection_lost = false;
var oppfound = false;
var recon = false;
$( document ).ready(function() {
  socket.emit('selection');
});
socket.on('reconnect', () => {
  console.log('you have been reconnected');
  recon = true;
  socket.emit('selection');
});
socket.on('reconnect_error', () => {
  console.log('attempt to reconnect has failed');
});

socket.on('btcancel',function() {
  stage.getChildByName('choose').getChildByName('choosetxt').text = 'BATTLE CANCELED!';
  stage.getChildByName('choose').getChildByName('searchOPImg').image = btcancel;
  stage.getChildByName('choose').getChildByName('sharingan').visible = false;
  stage.getChildByName('choose').getChildByName('cancelImg').image = okImg;

});

socket.on('found',function() {
  clearInterval(int_search);

  stage.getChildByName('choose').getChildByName('sharingan').image = mang;
  stage.getChildByName('choose').getChildByName('sharingan').x += 1;
  stage.getChildByName('choose').getChildByName('sharingan').y -= 1;
  stage.getChildByName('choose').getChildByName('choosetxt').text = 'OPPONENT FOUND!';
  stage.getChildByName('choose').getChildByName('cancelImg').visible = false;
  stage.getChildByName('choose').getChildByName('attemp').visible = true;
  animSha = false;
  oppfound = true;
  setTimeout(function(){window.location = "/battle"; }, 1000);
});
socket.on('disconnect',function() {
  console.log('Disconnected');
  // socket.emit('reconect');
  // console.log('Connected');


  if(!oppfound){
    connection_lost = true;
    stage.getChildByName('fImg').visible = true;
  }

});
socket.on('loadselection',function(data) {
  // console.log(data);

  if(!recon){
    player = data;
    if(player.inbattle == 1)window.location = "/battle";
    else loadImgs();
  }else {
    connection_lost = false;
    stage.getChildByName('fImg').visible = false;
  }
});
var infos;
var perg;
function createbottons() {
  var bt = new createjs.Bitmap();
  bt.image = logoutImg;
  bt.name = 'logout';
  bt.x = 23;
  bt.y = 255;
  bt.addEventListener('click',function () {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userInfo');
    window.location = "/login";
  });

  stage.addChild(bt);
  bt = new createjs.Bitmap();
  bt.image = ladderImg;
  bt.name = 'ladder';
  bt.x = 153;
  bt.y = 255;
  bt.addEventListener('click',function() {
    if(contselected == 3){
      stage.getChildByName('choose').getChildByName('choosetxt').text = "SEARCHING FOR AN OPPONENT...";
      socket.emit('search',{type : 'ladder', chars : player.selected});

      // int_search = setInterval(function () {
      //   socket.emit('search',{type : 'ladder', chars : player.selected});
      //   // console.log('search');
      //
      // }, 5000);
      stage.getChildByName('fImg').visible = true;
      stage.getChildByName('choose').visible = true;

      stage.getChildByName('choose').getChildByName('sharingan').visible = true;
      stage.getChildByName('choose').getChildByName('searchOPImg').image = searchOPImg;

      stage.getChildByName('choose').getChildByName('searchOPImg').visible = true;
      stage.getChildByName('choose').getChildByName('borda').visible = true;
      stage.getChildByName('choose').getChildByName('cancelImg').x = 170;


      animSha = true;
    }
  });
  stage.addChild(bt);

  stage.addChild(bt);
  bt = new createjs.Bitmap();
  bt.image = quickImg;
  bt.name = 'quick';
  bt.x = 356;
  bt.y = 255;
  bt.addEventListener('click',function() {
    if(contselected == 3){
      stage.getChildByName('choose').getChildByName('choosetxt').text = "SEARCHING FOR AN OPPONENT...";
      socket.emit('search',{type : 'quick', chars : player.selected});
      // int_search = setInterval(function () {
      //   socket.emit('search',{type : 'quick', chars : player.selected});
      //   // console.log('search');
      // }, 5000);
      stage.getChildByName('fImg').visible = true;
      stage.getChildByName('choose').visible = true;
      stage.getChildByName('choose').getChildByName('sharingan').visible = true;
      stage.getChildByName('choose').getChildByName('searchOPImg').image = searchOPImg;

      stage.getChildByName('choose').getChildByName('searchOPImg').visible = true;
      stage.getChildByName('choose').getChildByName('borda').visible = true;
      stage.getChildByName('choose').getChildByName('cancelImg').x = 170;


      animSha = true;
    }
  });
  stage.addChild(bt);

  stage.addChild(bt);
  bt = new createjs.Bitmap();
  bt.image = privateImg;
  bt.name = 'private';
  bt.x = 562;
  bt.y = 255;
  // bt.alpha = 0.5;
  bt.addEventListener('click',function() {
    if(contselected == 3){
      stage.getChildByName('fImg').visible = true;
      stage.getChildByName('choose').visible = true;

      stage.getChildByName('choose').getChildByName('sharingan').visible = false;
      stage.getChildByName('choose').getChildByName('searchOPImg').visible = false;
      stage.getChildByName('choose').getChildByName('borda').visible = false;
      stage.getChildByName('choose').getChildByName('choosetxt').text = "ENTER YOUR OPPONENT'S NAME:";

      stage.getChildByName('choose').getChildByName('cancelImg').x =  170 + 50;
      stage.getChildByName('okImg').visible = true;
      stage.getChildByName('input').visible = true;
      stage.getChildByName('bordainput').visible = true;
    }
  });

  stage.addChild(bt);



}
function createdivs() {
  var infocont = new createjs.Container();
  infocont.name = 'selection';
  infos = new createjs.Bitmap();
  infos.image = infoImg;
  infocont.x = 52;
  infocont.y = 315;

  infocont.addChild(infos);
  perg = new createjs.Bitmap();
  perg.image = pergImg;
  perg.x = 23;
  perg.y = 306;
  stage.addChild(infocont);
  stage.addChild(perg);
  var col = 0;
  var lin = -1;
  for (var i = 0; i < 21; i++) {

    var charcont = new createjs.Container();
    charcont.name = 'selectioncont'+i;
    charcont.i = i;
    touchtime2[player.chars[i].order] = 0;
    lin++;
    if(i > 1 && i%7 == 0 ) {
      col++;
      lin = 0;
    }
    var char = new createjs.Bitmap();
    char.image = charsImg[i];
    char.name = 'image';
    char.scaleX = 0.68;
    char.scaleY = 0.68;
    for (var w = 0; w < 3; w++) {
      if(player.selected[w].id == player.chars[i].order){
        char.alpha = 0;
      }
    }

    if(player.chars[i].unlocked == 0)char.alpha = 0.4;

    var newcharshape = new createjs.Shape();
    newcharshape.graphics.beginFill("#ac9d72");
    newcharshape.graphics.drawRect(0, 0, 50, 50);
    newcharshape.x = char.x;
    newcharshape.y = char.y;

    var charshape = new createjs.Shape();

    charshape.name = 'borda';
    charshape.graphics.beginStroke("#000000");
    charshape.graphics.setStrokeStyle(1);
    charshape.snapToPixel = true;
    charshape.graphics.drawRect(0, 0, 51, 51);
    charshape.x = char.x - 0.5;
    charshape.y = char.y - 0.5;
    char.mask = charshape;
    charcont.addChild(newcharshape);
    charcont.addChild(char);
    charcont.addChild(charshape);
    charcont.x = 40+(lin*60);
    charcont.y = 25+(col*60);
    char.character_id = player.chars[i].order;
    char.i = i;

    if(player.chars[i].unlocked == 1){
      char.addEventListener("click",function (event) {
        charclick(event);
        dbclick2(event);
      });
    }

    infocont.addChild(charcont);
  }

  var perficont = new createjs.Container();
  var perf = new createjs.Bitmap();
  perf.image = perfImg;
  var charshape = new createjs.Shape();
  charshape.name = 'borda';
  charshape.graphics.beginStroke("#000000");
  charshape.graphics.setStrokeStyle(1);
  charshape.snapToPixel = true;
  charshape.graphics.drawRect(0, 0, 76, 76);
  charshape.x = perf.x - 0.5;
  charshape.y = perf.y - 0.5;
  perf.mask = charshape;
  perficont.addChild(perf);
  perficont.addChild(charshape);
  perficont.x = 490;
  perficont.y = 25;
  infocont.addChild(perficont);

  var nametext = new createjs.Text('', "12px Franklin", "#000");
  nametext.x = 573;
  nametext.text = player.username.toUpperCase()+'\n'+player.rank.toUpperCase()+'\nCLAN: '+player.clan_tag.toUpperCase()+'\nLEVEL: '+player.level+' ('+player.exp+' XP)\nLADDERRANK: '+player.ladderrank+'\nRATIO: '+player.wins+' - '+player.losses+' ('+player.streak+')';
  nametext.y = 32;
  nametext.lineHeight = 14;
  nametext.textBaseline = "alphabetic";

  infocont.addChild(nametext);

  // var selec = new createjs.Bitmap();
  // selec.image = selectImg;
  // selec.x = 478;
  // selec.y = 110;
  // infocont.addChild(selec);

  for (var i = 0; i < 3; i++) {
    var  charcont = new createjs.Container();
    charcont.name = name = 'selected'+i;
    var char = new createjs.Bitmap();
    char.image = charsImg[player.selected[i].i];
    char.scaleX = 0.68;
    char.scaleY = 0.68;
    char.name = 'image';


    var newcharshape = new createjs.Shape();
    newcharshape.graphics.beginFill("#ac9d72");
    newcharshape.graphics.drawRect(0, 0, 50, 50);
    newcharshape.x = char.x;
    newcharshape.y = char.y;

    var charshape = new createjs.Shape();
    charshape.name = 'borda';
    charshape.graphics.beginStroke("#000000");
    charshape.graphics.setStrokeStyle(1);
    charshape.snapToPixel = true;
    charshape.graphics.drawRect(0, 0, 51, 51);
    charshape.x = char.x - 0.5;
    charshape.y = char.y - 0.5;
    char.mask = charshape;
    charcont.addChild(newcharshape);
    charcont.addChild(char);
    charcont.addChild(charshape);
    charcont.x = 489+(i*60);
    charcont.y = 122;

    char.character_id = player.selected[i].id;
    char.pos = i;
    char.i = player.selected[i].i;

    char.addEventListener('click',function (event) {
      charclick(event);
      dbclick(event);
    });

    infocont.addChild(charcont);
  }





  var nametext = new createjs.Text('', "12px Franklin", "#000");
  nametext.x = 575;
  // if()nametext.text = 'SELECT 3 CHARACTERS INTO YOUR TEAM';
  nametext.text = 'YOU ARE READY TO START A GAME';
  nametext.name = 'ready';
  nametext.y = 180;
  nametext.textAlign = 'center';
  infocont.addChild(nametext);

  var pag = new createjs.Bitmap();
  pag.image = pagImg;
  pag.x = 495;
  pag.y = 450;
  pag.addEventListener('click',function() {
    var maxpags = Math.floor(player.chars.length / 21);
    if(pagActual >= maxpags)pagActual = 0;
    else pagActual++;
    atualizarPag();


  });
  stage.addChild(pag);

  var pag = new createjs.Bitmap();
  pag.image = pagImg;
  pag.x = 95;
  pag.scaleX = -1;
  pag.y = 325;
  pag.addEventListener('click',function() {
    var maxpags = Math.floor(player.chars.length / 21);
    if(pagActual == 0)pagActual = maxpags;
    else pagActual--;
    atualizarPag();


  });
  stage.addChild(pag);


}

function animPerg() {
  // console.log(select_c);
  if(per.x == 145){
    stage.getChildByName('infotop').getChildByName('charname').text = player.chars[select_c].name.toUpperCase();
    stage.getChildByName('infotop').getChildByName('skillname').text = player.chars[select_c].name.toUpperCase();
    stage.getChildByName('infotop').getChildByName('description').text = player.chars[select_c].description.toUpperCase();
    stage.getChildByName('infotop').getChildByName('charcont').getChildByName('charimage').image = charsImg[select_i];
    stage.getChildByName('infotop').getChildByName('imageselcont').getChildByName('imagesel').image = charsImg[select_i];


    for (var i = 0; i < 4; i++) {
      stage.getChildByName('infotop').getChildByName('skillcont'+i).getChildByName('skillimg').image = skillsImg[select_i][i];
    }
  }
  if (per.x - 5 < newpo || per.x - 5 > newpo)
  {
      pos_diff = newpo - per.x;
      per.x = per.x + pos_diff / 2.2;
      if(newpo == 145 && per.x < 250 && select_c == -1){
        per.alpha -= 0.1;
        stage.getChildByName('infotop').alpha -=0.1;

      }
  }

  if(per.x >= newpo){
    if(per.x - newpo < 1)per.x = newpo;
  }else {
    if(newpo - per.x  < 1)per.x = newpo;
  }
  if(per.x == 145 && select_c == -1){
    per.visible = false;
    stage.getChildByName('infotop').visible = false;
    pergopen = false;
    per.alpha = 1;
    stage.getChildByName('infotop').alpha = 1;
  }

  if(per.x == per.old_x)pergopen = false;
  if(per.x == 145 && select_c != -1){
    per.alpha = 1;
    stage.getChildByName('infotop').alpha = 1;
    if(per.x != per.old_x)newpo = per.old_x;
    else newpo = 145;
  }


  stage.getChildByName('animBord').graphics.clear().beginStroke("#000000").drawRect(0, 0, per.x+10-145, 222);

  // slade.sourceRect = new createjs.Rectangle(per.x+10,20,555,222);
  // slade.x = per.x+10;

}
function charclick(event) {
  var char = event.currentTarget;

  if(player.chars[char.i].unlocked == 1){
    var infocont = stage.getChildByName('infotop');

    infocont.getChildByName('energycont').alpha =  0;
    infocont.getChildByName('infoclasslist').alpha = 0;
    infocont.getChildByName('infocooldown').alpha = 0;




    if(select_c !=  char.i){
      per.visible = true;
      infocont.visible = true;
      if(newpo == 680){
        newpo = 145;
      }
      else{
        newpo = 680;
      }
      select_c = char.i;
      select_i = char.i;
      pergopen = true;

    }
  }
}
function skillclick(event) {
  var infocont = stage.getChildByName('infotop');

  var skill = event.currentTarget;
  select_s = skill.skill_id;
  var energy = player.chars[select_c].skill[skill.skill_id].energy;
  infocont.getChildByName('energycont').alpha = 1;
  infocont.getChildByName('infoclasslist').alpha =1;
  infocont.getChildByName('infocooldown').alpha = 1;
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
  infocont.getChildByName('infoclasslist').text = clas;
  if(player.chars[select_c].skill[skill.skill_id].cooldown >0)infocont.getChildByName('infocooldown').text = 'COOLDOWN: '+ parseInt(player.chars[select_c].skill[skill.skill_id].cooldown);
  else infocont.getChildByName('infocooldown').alpha = 0;

  infocont.getChildByName('skillname').text = player.chars[select_c].skill[skill.skill_id].name.toUpperCase();
  infocont.getChildByName('description').text = player.chars[select_c].skill[skill.skill_id].description.toUpperCase();
  infocont.getChildByName('imageselcont').getChildByName('imagesel').image = skillsImg[select_i][skill.skill_id];

  var clas = 'CLASSLIST: ';
  var classes = player.chars[select_c].skill[skill.skill_id].classlist;
  for (var z in classes) {
    if(z==0)clas += classes[z].toUpperCase();
    else clas += ', '+classes[z].toUpperCase();
  }
  infocont.getChildByName('infoclasslist').text = clas;
}
var touchtime = [];
touchtime[0] = 0;
touchtime[1] = 0;
touchtime[2] = 0;
function dbclick(event){
  var char = event.currentTarget;
  if (touchtime[char.pos] == 0) {
      touchtime[char.pos] = new Date().getTime();

  } else {
      if (((new Date().getTime()) - touchtime[char.pos]) < 800) {
          var selectioncontvar = 0;
          if(pagActual > 0){
            selectioncontvar = char.i - (pagActual * 21);
          }
          else selectioncontvar =  char.i;
          stage.getChildByName('selection').getChildByName('selected'+char.pos).getChildByName('image').visible = 0;
          if(selectioncontvar >= 0 && selectioncontvar < 21)stage.getChildByName('selection').getChildByName('selectioncont'+selectioncontvar).getChildByName('image').alpha = 1;
          player.selected[char.pos] = null;
          // console.log( player.selected);
          touchtime[char.pos] = 0;
          contselected--;
          stage.getChildByName('ladder').alpha = 0.5;
          stage.getChildByName('quick').alpha = 0.5;
          stage.getChildByName('private').alpha = 0.5;
          if(contselected == 0)stage.getChildByName('selection').getChildByName('ready').text = 'SELECT 3 CHARACTERS INTO YOUR TEAM';
          if(contselected == 1)stage.getChildByName('selection').getChildByName('ready').text = 'SELECT 2 MORE CHARACTERS INTO YOUR TEAM';
          if(contselected == 2)stage.getChildByName('selection').getChildByName('ready').text = 'SELECT 1 MORE CHARACTERS INTO YOUR TEAM';
          if(contselected == 3)stage.getChildByName('selection').getChildByName('ready').text = 'YOU ARE READY TO START A GAME';

          //remover selected1

      } else {
          touchtime[char.pos] = new Date().getTime();
      }
  }
}
function dbclick2(event){
  var char = event.currentTarget;
  // console.log(touchtime2[char.character_id]);
  if (touchtime2[char.character_id] == 0) {
      touchtime2[char.character_id] = new Date().getTime();

  } else {
      if (((new Date().getTime()) - touchtime2[char.character_id]) < 800) {
          touchtime2[char.character_id] = 0;
          // console.log('entrou');
          var pos = -1;
          if(player.selected[0] == null)pos = 0;
          else if (player.selected[1] == null)pos = 1;
          else if (player.selected[2] == null)pos = 2;

          if(pos != -1){
            contselected++;
            if(contselected == 3){
              stage.getChildByName('ladder').alpha = 1;
              stage.getChildByName('quick').alpha = 1;
              stage.getChildByName('private').alpha = 1;
            }
            var selectioncontvar = 0;
            if(pagActual > 0){
              selectioncontvar = char.i - (pagActual * 21);
            }
            else selectioncontvar =  char.i;

            if(selectioncontvar >= 0 && selectioncontvar < 21)stage.getChildByName('selection').getChildByName('selectioncont'+selectioncontvar).getChildByName('image').alpha = 0;
            stage.getChildByName('selection').getChildByName('selected'+pos).getChildByName('image').image = charsImg[char.i];
            stage.getChildByName('selection').getChildByName('selected'+pos).getChildByName('image').visible = 1;
            stage.getChildByName('selection').getChildByName('selected'+pos).getChildByName('image').character_id = char.character_id;
            stage.getChildByName('selection').getChildByName('selected'+pos).getChildByName('image').i = char.i;
            if(contselected == 0)stage.getChildByName('selection').getChildByName('ready').text = 'SELECT 3 CHARACTERS INTO YOUR TEAM';
            if(contselected == 1)stage.getChildByName('selection').getChildByName('ready').text = 'SELECT 2 MORE CHARACTERS INTO YOUR TEAM';
            if(contselected == 2)stage.getChildByName('selection').getChildByName('ready').text = 'SELECT 1 MORE CHARACTERS INTO YOUR TEAM';
            if(contselected == 3)stage.getChildByName('selection').getChildByName('ready').text = 'YOU ARE READY TO START A GAME';
            player.selected[pos] = {};
            player.selected[pos].id = char.character_id;
            player.selected[pos].i = char.i;
            // console.log(player.selected);

          }
      } else {
          touchtime2[char.character_id] = new Date().getTime();
      }
  }
}
function createtop() {
  var infocont = new createjs.Container();
  infocont.x = 145;
  infocont.y = 20;
  infocont.name = 'infotop';
  infocont.visible = false;

  infos = new createjs.Bitmap();
  infos.image = infotopImg;


  infocont.addChild(infos);
  perg = new createjs.Bitmap();
  perg.image = pergImg;
  perg.old_x = 680;
  perg.old_y = 10;
  perg.x = 145;
  perg.y = 10;
  perg.visible = false;
  perg.name = 'pergopen';
  perg.addEventListener('click',function() {
    pergopen = true;
    newpo = 145;
    select_c = -1;
    select_s = -1;
  });



  var nametext = new createjs.Text('', "15px Franklin", "#bd262c");
  nametext.x = 20;
  nametext.y = 15;
  nametext.name = 'charname';
  nametext.text = player.chars[0].name.toUpperCase();
  infocont.addChild(nametext);

  var nametext = new createjs.Text('', "15px Franklin", "#bd262c");
  nametext.x = 20;
  nametext.y = 120;
  nametext.name = 'skillname';
  nametext.text = player.chars[0].name.toUpperCase();
  infocont.addChild(nametext);

  var nametext = new createjs.Text('', "12px Franklin", "#151311");
  nametext.text = player.chars[0].description.toUpperCase();
  nametext.x = 20;
  nametext.name = 'description';
  nametext.y = 140;
  nametext.lineWidth = 415;
  nametext.lineHeight = 15;

  infocont.addChild(nametext);
  var charcont = new createjs.Container();
  charcont.name = 'charcont';




  var infotxtclass = new createjs.Text('CLASSES: CHAKRA, RANGED, INSTANT', "10px Franklin", "#7d6f4c");
  infotxtclass.x = 20;
  infotxtclass.y = 200;
  infotxtclass.name = 'infoclasslist';
  infotxtclass.alpha = 0;

  infocont.addChild(infotxtclass);

  var infotxtcool = new createjs.Text('COOLDOWN: 1', "10px Franklin", "#7d6f4c");
  infotxtcool.x = 340;
  infotxtcool.y = 200;
  infotxtcool.name = 'infocooldown';
  infotxtcool.alpha = 0;

  infocont.addChild(infotxtcool);


  var energycont = new createjs.Container();
  energycont.name = 'energycont';
  energycont.x = 340;
  energycont.y = 29+95;
  var infotxtname = new createjs.Text('ENERGY: ', "10px Franklin", "#7d6f4c");

  infotxtname.name = 'infoenergy';
  infotxtname.alpha = 1;
  energycont.alpha = 0;

  energycont.addChild(infotxtname);
  for (var i = 0; i < 5; i++) {
    var chak = new createjs.Bitmap();
    chak.image = chakras[4];
    chak.x = 37+ i*13;
    chak.name = 'energy_'+i;
    energycont.addChild(chak);

  }
  infocont.addChild(energycont);

  var char = new createjs.Bitmap();
  char.image = charsImg[0];
  char.name = 'charimage';

  var charshape = new createjs.Shape();
  charshape.name = 'borda';
  charshape.graphics.beginStroke("#000000");
  charshape.graphics.setStrokeStyle(1);
  charshape.snapToPixel = true;
  charshape.graphics.drawRect(0, 0, 76, 76);
  charshape.x = char.x - 0.5;
  charshape.y = char.y - 0.5;
  char.mask = charshape;
  charcont.addChild(char);
  charcont.addChild(charshape);
  charcont.x = 20;
  charcont.y = 35;
  charcont.addEventListener("click",function(event){
    var infocont = stage.getChildByName('infotop');

    infocont.getChildByName('energycont').alpha =  0;
    infocont.getChildByName('infoclasslist').alpha = 0;
    infocont.getChildByName('infocooldown').alpha = 0;
    stage.getChildByName('infotop').getChildByName('skillname').text = player.chars[select_c].name.toUpperCase();
    stage.getChildByName('infotop').getChildByName('description').text = player.chars[select_c].description.toUpperCase();
    stage.getChildByName('infotop').getChildByName('imageselcont').getChildByName('imagesel').image = charsImg[player.chars[select_c].order];

  });

  infocont.addChild(charcont);

  for (var i = 0; i < 4; i++) {
    var charcont = new createjs.Container();
    charcont.name = 'skillcont'+i;
    var char = new createjs.Bitmap();
    char.image = skillsImg[0][i];
    char.name = 'skillimg';

    var charshape = new createjs.Shape();
    charshape.name = 'borda';
    charshape.graphics.beginStroke("#000000");
    charshape.graphics.setStrokeStyle(1);
    charshape.snapToPixel = true;
    charshape.graphics.drawRect(0, 0, 76, 76);
    charshape.x = char.x - 0.5;
    charshape.y = char.y - 0.5;
    char.mask = charshape;
    charcont.addChild(char);
    charcont.addChild(charshape);
    charcont.x = 160+(i*95);
    charcont.y = 35;
    charcont.skill_id = i;
    infocont.addChild(charcont);

    charcont.addEventListener("click",skillclick);

  }

  var charcont = new createjs.Container();
  charcont.name = 'imageselcont';
  var char = new createjs.Bitmap();
  char.image = charsImg[0];
  char.name = 'imagesel';
  var charshape = new createjs.Shape();
  charshape.name = 'borda';
  charshape.graphics.beginStroke("#000000");
  charshape.graphics.setStrokeStyle(1);
  charshape.snapToPixel = true;
  charshape.graphics.drawRect(0, 0, 76, 76);
  charshape.x = char.x - 0.5;
  charshape.y = char.y - 0.5;
  char.mask = charshape;
  charcont.addChild(char);
  charcont.addChild(charshape);
  charcont.x = 160+(3*95);
  charcont.y = 125;
  infocont.addChild(charcont);

  var charshape = new createjs.Shape();
  charshape.name = 'animBord';
  charshape.alpha = 0;
  charshape.graphics.beginStroke("#000000");
  charshape.graphics.setStrokeStyle(1);
  charshape.snapToPixel = true;
  charshape.graphics.drawRect(0, 0, 0, 0);
  charshape.x = infocont.x - 0.5;
  charshape.y = infocont.y - 0.5;
  infocont.mask = charshape;





  stage.addChild(charshape);
  stage.addChild(infocont);
  // var crop = new createjs.Bitmap();
  // crop.name = 'slade';
  // crop.sourceRect = new createjs.Rectangle(155,20,555,222);
  // crop.x = 155;
  // crop.y = 20;
  // crop.image = backgroundImg;
  //
  // stage.addChild(crop);
  stage.addChild(perg);
  per = stage.getChildByName('pergopen');
  // slade = stage.getChildByName('slade');


}
function createchoose() {
  var f = new createjs.Bitmap();
  f.image = fImg;
  f.name = 'fImg';
  f.alpha = 0.3;
  f.visible = false;
  stage.addChild(f);

  var choose = new createjs.Container();
  choose.name = 'choose';
  choose.x = 200;
  choose.y = 100;
  choose.visible = false;
  var chooseIm = new createjs.Bitmap();
  chooseIm.image = chooseImg;
  chooseIm.name = 'chooseImg';
  var searchOP = new createjs.Bitmap();
  searchOP.image = searchOPImg;
  searchOP.name = 'searchOPImg';
  searchOP.x = 120;
  searchOP.y = 80;

  var sharingan = new createjs.Bitmap();
  sharingan.image = shari;
  sharingan.name = 'sharingan';
  sharingan.x = 220;
  sharingan.y = 140;
  sharingan.regX = sharingan.regY = 32.5;


  var choosetxt = new createjs.Text('SEARCHING FOR AN OPPONENT...', "16px Franklin", "#fe1d19");
  choosetxt.name = 'choosetxt';
  choosetxt.x = 215;
  choosetxt.y = 50;
  choosetxt.textAlign = 'center';

  var newchoosetxt = new createjs.Text('ATTEMPTING TO ENTER BATTLE...', "16px Franklin", "#151311");
  newchoosetxt.name = 'attemp';
  newchoosetxt.x = 215;
  newchoosetxt.y = 220;
  newchoosetxt.textAlign = 'center';
  newchoosetxt.visible = false;


  var cancel = new createjs.Bitmap();
  cancel.image = cancelImg;
  cancel.name = 'cancelImg';
  cancel.x = 170;
  cancel.y = 220;

  cancel.addEventListener('click',function () {
    socket.emit('cancelSearch');
    clearInterval(int_search);
    stage.getChildByName('fImg').visible = false;
    stage.getChildByName('choose').visible = false;
    stage.getChildByName('okImg').visible = false;
    stage.getChildByName('input').visible = false;
    stage.getChildByName('bordainput').visible = false;
  });

  var charshape = new createjs.Shape();
  charshape.name = 'borda';
  charshape.graphics.beginStroke("#000000");
  charshape.graphics.setStrokeStyle(1);
  charshape.snapToPixel = true;
  charshape.graphics.drawRect(0, 0, 193, 126);
  charshape.x = searchOP.x - 0.5;
  charshape.y = searchOP.y - 0.5;
  searchOP.mask = charshape;

  choose.addChild(chooseIm);
  choose.addChild(searchOP);
  choose.addChild(sharingan);
  choose.addChild(charshape);
  choose.addChild(cancel);
  choose.addChild(choosetxt);
  choose.addChild(newchoosetxt);

  stage.addChild(choose);
}
function createprivate() {
  // Create and place our text field on the canvas



  const textField = new TextInput();
  textField.y = 220;
  textField.name = 'input';
  textField.x = 320;
  textField.alpha = 0.5;
  textField.visible = false;

  // textField.placeHolderTextColor = "#fff"; // updates the default text

  var charshape = new createjs.Shape();
  charshape.name = 'bordainput';
  charshape.visible = false;

  charshape.graphics.beginStroke("#000000");
  charshape.graphics.setStrokeStyle(1);
  charshape.snapToPixel = true;
  charshape.graphics.drawRect(0, 0, 200, 40);
  charshape.x = textField.x - 0.5;
  charshape.y = textField.y - 0.5;
  textField.mask = charshape;
  stage.addChild(textField);
  stage.addChild(charshape);

  var ok = new createjs.Bitmap();
  ok.image = okImg;
  ok.name = 'okImg';
  ok.visible = false;
  ok.x = stage.getChildByName('choose').x + stage.getChildByName('choose').getChildByName('cancelImg').x - 50;
  ok.y = stage.getChildByName('choose').y + stage.getChildByName('choose').getChildByName('cancelImg').y;

  ok.addEventListener('click',function () {
    if(contselected == 3 && textField._preCursorText.length > 0){
      socket.emit('search',{type : 'private',me: player.username, opponent: textField._preCursorText,chars : player.selected});
      stage.getChildByName('fImg').visible = true;
      stage.getChildByName('choose').visible = true;
      stage.getChildByName('choose').getChildByName('sharingan').visible = true;
      stage.getChildByName('choose').getChildByName('searchOPImg').image = searchOPImg;

      stage.getChildByName('choose').getChildByName('searchOPImg').visible = true;
      stage.getChildByName('choose').getChildByName('borda').visible = true;
      stage.getChildByName('choose').getChildByName('cancelImg').visible = true;
      stage.getChildByName('okImg').visible = false;
      stage.getChildByName('input').visible = false;
      stage.getChildByName('bordainput').visible = false;
      stage.getChildByName('choose').getChildByName('cancelImg').x = 170;

      stage.getChildByName('choose').getChildByName('choosetxt').text = "SEARCHING FOR "+textField._preCursorText.toUpperCase();

      animSha = true;
    }
    // console.log(textField._preCursorText);

  });
  stage.addChild(ok);

}
var newCursor = new createjs.Bitmap();
var load_b = false;
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

  createjs.Ticker.setFPS(14);

  createjs.Ticker.on("tick", function () {
    newCursor.x = stage.mouseX;
    newCursor.y = stage.mouseY;
    lostAtt();

    if(pergopen)animPerg();
    if(animSha)animSharingan();
    stage.update();
  });
}
var background = new createjs.Bitmap();
stage.addChild(background);
function animSharingan(){
  stage.getChildByName('choose').getChildByName('sharingan').rotation+=40;
}
function loadImgs(){
  var loader = new PxLoader();

  // backgroundImg = loader.addImage('http://i1249.photobucket.com/albums/hh518/SwizzyManeLeFlare/NarutoArenaBGs/Nindaime.png');
  if(player.background != '' && player.background != undefined)
    backgroundImg = loader.addImage(''+player.background);
  else
    backgroundImg = loader.addImage('https://i.imgur.com/0RkT8r2.png');

  perfImg = loader.addImage(''+player.avatar);
  perfImg.crossOrigin = true;

  selectImg = loader.addImage('images/select.png');
  chooseImg = loader.addImage('images/choose.png');
  cancelImg = loader.addImage('images/cancel.png');
  okImg = loader.addImage('images/ok.png');


  fImg = loader.addImage('images/f.png');

  searchOPImg = loader.addImage('images/searchOP.png');
  pagImg = loader.addImage('images/pag.png');
  infoImg = loader.addImage('images/infos.jpg');
  infotopImg = loader.addImage('images/infostop.jpg');
  pergImg = loader.addImage('images/per.png');
  logoutImg = loader.addImage('images/logout.png');
  ladderImg = loader.addImage('images/ladder.png');
  privateImg = loader.addImage('images/private.png');
  quickImg = loader.addImage('images/quick.png');
  kunai1 = loader.addImage('images/kunai.png');
  kunai2 = loader.addImage('images/kunai2.png');
  shuri = loader.addImage('images/shuri.png');
  shari = loader.addImage('images/shari.png');
  mang = loader.addImage('images/mang.png');
  btcancel = loader.addImage('images/btcancel.jpg');
  chakras[0] = loader.addImage('images/b_0.png');
  chakras[1] = loader.addImage('images/b_1.png');
  chakras[2] = loader.addImage('images/b_2.png');
  chakras[3] = loader.addImage('images/b_3.png');
  chakras[4] = loader.addImage('images/b_4.png');
  for (var i = 0; i < player.chars.length; i++) {
    charsImg[i] = loader.addImage(player.chars[i].image);
    charsImg[i].crossOrigin = true;
    skillsImg[i] = [];
    for (var y = 0; y < player.chars[i].skill.length; y++) {
      skillsImg[i][y] = loader.addImage(player.chars[i].skill[y].image);
      skillsImg[i][y].crossOrigin = true;

    }
  }
  backgroundImg.crossOrigin = true;

  loader.addCompletionListener(function() {
    loading = false;
    $("#load").remove();
      background.image = backgroundImg;
      createtop();
      createdivs();
      createbottons();
      // createselect();
      createchoose();
      createprivate();
      createconlost();

      createcursor();





    });
  loader.start();

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
    window.location = "/selection";
  });
  cont.addChild(ch);
  cont.addChild(choosetxt);

  cont.addChild(okI);

  stage.addChild(cont);
}

function lostAtt() {
  var ch = stage.getChildByName('contlost');
  if(connection_lost){
    ch.alpha = 1;
  }else{
    if(ch.alpha == 1)ch.alpha = 0;
  }
}
function atualizarPag() {
  for (var i = 0; i < 21; i++) {
    var n = (pagActual*21)+i;
    if(n < player.chars.length){
      // console.log(n,player.chars.length,player.chars[n].order);

      // stage.getChildByName('selection').getChildByName('selectioncont'+i).name = 'selectioncont'+player.chars[n].order;
      // console.log(n);
      stage.getChildByName('selection').getChildByName('selectioncont'+i).visible = true;

      stage.getChildByName('selection').getChildByName('selectioncont'+i).getChildByName('image').alpha = 1;
      stage.getChildByName('selection').getChildByName('selectioncont'+i).getChildByName('image').image = charsImg[n];
      stage.getChildByName('selection').getChildByName('selectioncont'+i).getChildByName('image').character_id = player.chars[n].order;
      stage.getChildByName('selection').getChildByName('selectioncont'+i).getChildByName('image').i = n;
      for (var w = 0; w < 3; w++) {
        if(player.selected[w] != null){
          if(player.selected[w].id == player.chars[n].order){
            stage.getChildByName('selection').getChildByName('selectioncont'+i).getChildByName('image').alpha  = 0;
          }
        }

      }
      if(player.chars[n].unlocked == 0)stage.getChildByName('selection').getChildByName('selectioncont'+i).getChildByName('image').alpha  = 0.4;


    }
    else stage.getChildByName('selection').getChildByName('selectioncont'+i).visible = false;
  }
  // stage.update();

}

var charsImg = [];
var skillsImg = [];


});
