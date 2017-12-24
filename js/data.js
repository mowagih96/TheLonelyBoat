//Models loader
var boatObject , boxObject , boxClone1 , boxClone2;
var boatLoader = new THREE.ObjectLoader();
boatLoader.load(
  'models/boat.json',
  function(object){
    boatObject = object;
    object.scale.set(0.5,0.5,0.5);
    object.position.y = -10;
  }
);

var boxLoader = new THREE.ObjectLoader();
boxLoader.load(
  'models/box.json',
  function(object){
    boxObject = object;
    object.scale.set(20.0,20.0,20.0);
    object.roughness = 3.5;
    boxClone1 = object.clone();
    boxClone2 = object.clone();
    object.position.set(100,-30,-100);
    boxClone1.position.set(50,-30,-300);
    boxClone2.position.set(-150,-30,-300);


  }
);

//bolt picture
var planeMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/bolt.png"),side: THREE.DoubleSide,alphaTest: 0.4}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/bolt.png"),side: THREE.DoubleSide,alphaTest: 0.4})
];


//bolt sound
var buffer1 , buffer2 , buffer3;
var audioLoader1 = new THREE.AudioLoader();
audioLoader1.load('sounds/bolt.mp3', function(buffer) {
  buffer1 = buffer;
});

var audioLoader2 = new THREE.AudioLoader();
audioLoader2.load('sounds/rain.mp3', function(buffer) {
  buffer2 = buffer;
});

var audioLoader3 = new THREE.AudioLoader();
audioLoader3.load('sounds/wind.mp3', function(buffer) {
  buffer3 = buffer;
});




//morning skyBox picture
var cubeMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_ft.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_bk.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_up.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_dn.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_rt.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_lf.png"),side: THREE.DoubleSide})
];


//night skybox pictures
var nightCubeMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_ft.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_bk.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_up.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_dn.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_rt.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_lf.png"),side: THREE.DoubleSide})
];


//Ocean


//Rain
var rainDrop = new THREE.TextureLoader().load('textures/drop.png');
rainDrop.wrapS = rainDrop.wrapT = THREE.RepeatWrapping;
var pointMaterial = new THREE.PointsMaterial({color: 'rgba(174,194,224)',size: 1.5 , map: rainDrop});
pointMaterial.alphaTest = 0.5;

//hurricane
var hurricaneMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/tornado.png"),side: THREE.DoubleSide,alphaTest: 0.4}),

];
