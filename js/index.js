window.setTimeout(start,10000);
function start(){
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

  //models
  scene.add(boatObject);
  requestAnimationFrame(moveBoat.bind(moveBoat,boatObject));
  requestAnimationFrame(rotateBoat.bind(rotateBoat,boatObject));

  scene.add(boxObject);
  scene.add(boxClone1);
  scene.add(boxClone2);
  requestAnimationFrame(moveBox.bind(moveBox,boxObject));
  requestAnimationFrame(moveBox.bind(moveBox,boxClone1));
  requestAnimationFrame(moveBox.bind(moveBox,boxClone2));
  requestAnimationFrame(rotateBox.bind(rotateBox,boxClone2));



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
  var bolt = new THREE.Mesh(planeGeometry , planeMaterial);
  bolt.position.set(-150,90,-350);
  var cloneBolt = bolt.clone();
  cloneBolt.position.x = 180;

  //Add the bolts to the scene after 5 seconds
  window.setTimeout(function(){
    var audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    var sound = new THREE.Audio(audioListener);
    sound.setBuffer(buffer1);
    sound.setLoop(false);
    sound.setVolume(1.5);
    sound.play();
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
  var skyBox = new THREE.Mesh(cubeGeometry , cubeMaterial);
  scene.add(skyBox);

  //Change the scene to night after 10 seconds
  window.setTimeout(function(){
    scene.remove(skyBox);
    cubeGeometry.dispose();
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
  var rain = new THREE.Points(pointGeometry,pointMaterial);
  rain.scale.y = 8.0;
  scene.add(rain);

  //Hurricane
  var hurricaneGeometry = new THREE.PlaneGeometry(300, 300 , 300);
  var hurricane = new THREE.Mesh(hurricaneGeometry , hurricaneMaterial);
  hurricane.position.set(-150,60,-450);
  scene.add(hurricane);

  //Sounds
  var audioListener = new THREE.AudioListener();
  camera.add(audioListener);
  var sound = new THREE.Audio(audioListener);
  sound.setBuffer();
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
  rain.add(sound);

  var audioListener1 = new THREE.AudioListener();
  camera.add(audioListener1);
  var sound1 = new THREE.Audio(audioListener1);
  sound1.setBuffer(buffer3);
  sound1.setLoop(true);
  sound1.setVolume(1.5);
  sound1.play();


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
}
