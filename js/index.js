//Global variables:
var x = -30 , a = 0;

//Renderer:
var renderer = new THREE.WebGLRenderer({canvas:document.getElementById('drawingBoard'),antialias:true});
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth , window.innerHeight);

//Camera:
var camera = new THREE.PerspectiveCamera(35,(window.innerWidth/window.innerHeight),0.1,3000);
camera.position.set( 0, 50, 300);

//Update the window on resize
window.addEventListener('resize',function(){
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width,height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//Scene:
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf5f5f5, 3,1000);

//Controller
var controller = new THREE.OrbitControls(camera,renderer.domElement);

//Models loader
var boatLoader = new THREE.ObjectLoader();
boatLoader.load(
  'models/boat.json',
  function(object){
    object.scale.set(0.5,0.5,0.5);
    object.position.y = -10;
    scene.add(object);
    requestAnimationFrame(moveBoat.bind(moveBoat,object));
    requestAnimationFrame(rotateBoat.bind(rotateBoat,object));
  }
);

var boxLoader = new THREE.ObjectLoader();
boxLoader.load(
  'models/box.json',
  function(object){
    object.scale.set(20.0,20.0,20.0);
    object.roughness = 3.5;
    var boxClone1 = object.clone();
    var boxClone2 = object.clone();
    object.position.set(100,-30,-100);
    boxClone1.position.set(50,-30,-300);
    boxClone2.position.set(-150,-30,-300);
    scene.add(object);
    scene.add(boxClone1);
    scene.add(boxClone2);
    requestAnimationFrame(moveBox.bind(moveBox,object));
    requestAnimationFrame(moveBox.bind(moveBox,boxClone1));
    requestAnimationFrame(moveBox.bind(moveBox,boxClone2));
    requestAnimationFrame(rotateBox.bind(rotateBox,boxClone2));
  }
);

//Lights:
renderer.shadowMap.enabled = true;
var sunLight = new THREE.HemisphereLight(0xffffff,0xffffff,2);
scene.add(sunLight);

var lightsFadingTimer =  setInterval(function(){
    if(sunLight.intensity >= 0.1) sunLight.intensity -= 0.1;
    else stopLFTimer();
  },1000);

function stopLFTimer(){
  clearInterval(lightsFadingTimer);
}

//Lightining bolt
var planeGeometry = new THREE.PlaneGeometry( 190, 190);
var planeMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/bolt.png"),side: THREE.DoubleSide,alphaTest: 0.4}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/bolt.png"),side: THREE.DoubleSide,alphaTest: 0.4})
];
var bolt = new THREE.Mesh(planeGeometry , planeMaterial);
bolt.position.set(-150,90,-350);
var cloneBolt = bolt.clone();
cloneBolt.position.x = 180;

//Add the bolts to the scene after 5 seconds
window.setTimeout(function(){
  var audioListener = new THREE.AudioListener();
  camera.add(audioListener);
  var sound = new THREE.Audio(audioListener);
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load('sounds/bolt.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1.5);
    sound.play();
  });
  scene.add(bolt);
  scene.add(cloneBolt);
},15000);

//Remove the bolts from the scene after 3 seconds
window.setTimeout(function(){
  scene.remove(bolt);
  scene.remove(cloneBolt);
  planeGeometry.dispose();
},18000);

//Skybox:
var cubeGeometry = new THREE.CubeGeometry(window.innerWidth,window.innerHeight,1000);
var cubeMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_ft.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_bk.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_up.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_dn.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_rt.png"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/stormydays_lf.png"),side: THREE.DoubleSide})
];
var skyBox = new THREE.Mesh(cubeGeometry , cubeMaterial);
scene.add(skyBox);

//Change the scene to night after 10 seconds
window.setTimeout(function(){
  scene.remove(skyBox);
  cubeGeometry.dispose();
  var nightCubeMaterial = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_ft.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_bk.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_up.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_dn.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_rt.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_lf.png"),side: THREE.DoubleSide})
  ];
  var nightSkyBox = new THREE.Mesh(cubeGeometry , nightCubeMaterial);
  scene.fog = new THREE.Fog(0x6f6767, 3,1000);
  scene.add(nightSkyBox);
},15000);

//Ocean:
var water = new THREE.Water(1000,1000,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function ( texture ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: sunLight.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x0077be,
        distortionScale: 0,
        fog: scene.fog != undefined
      }
    );
water.rotation.x = -Math.PI / 2;
water.position.y = -10;
water.receiveShadow = true;
scene.add(water);

//Rain:
var pointGeometry = new THREE.Geometry();
for(var i=0 ; i<1000000 ; i++){
  var point = new THREE.Vector3();
  point.x = (Math.random() * 800) - 400;
  point.y = (Math.random() * 800) - 400;
  point.z = (Math.random() * 800) - 400;
  pointGeometry.vertices.push(point);
}
var rainDrop = new THREE.TextureLoader().load('textures/drop.png');
rainDrop.wrapS = rainDrop.wrapT = THREE.RepeatWrapping;
var pointMaterial = new THREE.PointsMaterial({color: 'rgba(174,194,224)',size: 1.5 , map: rainDrop});
pointMaterial.alphaTest = 0.5;
var rain = new THREE.Points(pointGeometry,pointMaterial);
rain.scale.y = 8.0;
scene.add(rain);

//Hurricane
var hurricaneGeometry = new THREE.PlaneGeometry(300, 300 , 300);
var hurricaneMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/tornado.png"),side: THREE.DoubleSide,alphaTest: 0.4}),

];
var hurricane = new THREE.Mesh(hurricaneGeometry , hurricaneMaterial);
hurricane.position.set(-150,60,-450);
scene.add(hurricane);

//Sounds
var audioListener = new THREE.AudioListener();
camera.add(audioListener);
var sound = new THREE.Audio(audioListener);
var audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/rain.mp3', function(buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

var audioListener1 = new THREE.AudioListener();
camera.add(audioListener1);
var sound1 = new THREE.Audio(audioListener1);
var audioLoader1 = new THREE.AudioLoader();
audioLoader1.load('sounds/wind.mp3', function(buffer) {
  sound1.setBuffer(buffer);
  sound1.setLoop(true);
  sound1.setVolume(1.5);
  sound1.play();
});

//Shadows:
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

//Render loop:
requestAnimationFrame(render);

//Functions
function moveBoat(object){
  object.position.x -= 0.3;
  requestAnimationFrame(moveBoat.bind(moveBoat,object));
}

function rotateBoat(object){
  if(hurricane.position.z >= object.position.z - 27 && hurricane.position.z <= object.position.z + 27){
    object.rotation.x += 0.09;
    object.position.y -= 3;
  }
  else if(object.position.y <= -10) object.position.y += 1;
  requestAnimationFrame(rotateBoat.bind(rotateBoat,object));
}
function rotateBox(object){
  if(hurricane.position.z >= object.position.z - 27 && hurricane.position.z <= object.position.z + 27){
    object.position.x -= 1;
    object.position.z += 0.5;
    object.rotation.x += 0.1;
    object.rotation.y += 0.1;
  }
  requestAnimationFrame(rotateBox.bind(rotateBox,object));
}

function moveBox(object){
  object.position.y = Math.cos(x) - 20;
  x += 0.1;
  requestAnimationFrame(moveBox.bind(moveBox,object));
}

function render(){
  water.material.uniforms.time.value += 1.0 / 60.0;
  water.material.uniforms.distortionScale.value = 3.7;
  rain.position.y -= 1;
  if(rain.position.y == -400) rain.position.y = 400;
  hurricane.rotation.y += Math.PI/4;
  hurricane.position.z += 1;
  renderer.render(scene,camera);
  requestAnimationFrame(render);
}
