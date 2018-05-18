var Pipe_length=0,Pipe_inner_diameter=0,Pipe_outer_diameter=-0,Pipe_center_position,Parallelepiped_x=0,Parallelepiped_y=0,Parallelepiped_z=0,Parallelepiped_center_position,pc,ppc;
var scene;
var camera;
var renderer,controls;
var ambient_light;
var day_light;
var currently_pressed_keys = {};
var composer;
var effect, effect2, effect3, effect4;
new componantsList = [];

initscene();


function generatepipe(){
	if(document.getElementById("Pipe_length").value && document.getElementById("Pipe_inner_diameter").value && document.getElementById("Pipe_outer_diameter").value && document.getElementById("Pipe_center_position_x").value && document.getElementById("Pipe_center_position_y").value && document.getElementById("Pipe_center_position_z").value ){
		Pipe_length = parseInt(document.getElementById("Pipe_length").value);
		Pipe_inner_diameter = parseInt(document.getElementById("Pipe_inner_diameter").value);
		Pipe_outer_diameter = parseInt(document.getElementById("Pipe_outer_diameter").value);
		Pipe_center_position = new THREE.Vector3(parseInt(document.getElementById("Pipe_center_position_x").value),parseInt(document.getElementById("Pipe_center_position_y").value),parseInt(document.getElementById("Pipe_center_position_z").value));
		var color = document.getElementById("Pipe_color").value;
		pc = parseInt(color.substring(1),16);
		insertpipe();		
	}	
	else
		alert("Please enter all Pipe Dimensions");
}

function generatecube(){
	if(document.getElementById("Parallelepiped_x").value && document.getElementById("Parallelepiped_y").value && document.getElementById("Parallelepiped_z").value && document.getElementById("Parallelepiped_center_position_x").value && document.getElementById("Parallelepiped_center_position_y").value && document.getElementById("Parallelepiped_center_position_z").value){		
		Parallelepiped_x = parseInt(document.getElementById("Parallelepiped_x").value);
		Parallelepiped_y = parseInt(document.getElementById("Parallelepiped_y").value);
		Parallelepiped_z = parseInt(document.getElementById("Parallelepiped_z").value);
		Parallelepiped_center_position = new THREE.Vector3(parseInt(document.getElementById("Parallelepiped_center_position_x").value),parseInt(document.getElementById("Parallelepiped_center_position_y").value),parseInt(document.getElementById("Parallelepiped_center_position_z").value));
		var color = document.getElementById("Parallelepiped_color").value;
		ppc = parseInt(color.substring(1),16);
		insertcube();		
	}	
	else
		alert("Please enter all Parallelepiped Dimensions.");
}

function initscene(){
	


	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 60, (window.innerWidth*0.75)/window.innerHeight, 1, 10000 );
	
	camera.position.x = -300;
	camera.position.y = 1000;
	camera.position.z = 0;
	
	
	scene.add(camera);
	
	renderer = new THREE.WebGLRenderer({alpha:true,});
	renderer.setSize( window.innerWidth*0.75, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	document.getElementById("container").appendChild( renderer.domElement );
	
	controls = new THREE.TrackballControls(camera,renderer.domElement);
	controls.maxDistance = 3000;
	
	day_light = new THREE.DirectionalLight(0xffffff, 0.8);
	day_light.position.set( 0.25, 1, -0.25 );
	scene.add(day_light);
	ambient_light = new THREE.AmbientLight(0xffffff);
	scene.add(ambient_light);
	
	
	// sky box creation 
	var textureLoader = new THREE.TextureLoader();
	var texture0 = textureLoader.load( 'image/skybox/under_water/uw_ft.jpeg' );
	var texture1 = textureLoader.load( 'image/skybox/under_water/uw_bk.jpeg' );
	var texture2 = textureLoader.load( 'image/skybox/under_water/up2.jpg' );
	var texture3 = textureLoader.load( 'image/skybox/under_water/dn2.jpg' );
	var texture4 = textureLoader.load( 'image/skybox/under_water/uw_rt.jpeg' );
	var texture5 = textureLoader.load( 'image/skybox/under_water/uw_lf.jpeg' );
	var materials = [
		new THREE.MeshBasicMaterial( { map: texture0, side:THREE.BackSide, fog:false } ),
		new THREE.MeshBasicMaterial( { map: texture1, side:THREE.BackSide, fog:false } ),
		new THREE.MeshBasicMaterial( { map: texture2, side:THREE.BackSide, fog:false } ),
		new THREE.MeshBasicMaterial( { map: texture3, side:THREE.BackSide, fog:false } ),
		new THREE.MeshBasicMaterial( { map: texture4, side:THREE.BackSide, fog:false } ),
		new THREE.MeshBasicMaterial( { map: texture5, side:THREE.BackSide, fog:false } )
	];
	var faceMaterial = new THREE.MeshFaceMaterial( materials );
	var geometry = new THREE.BoxGeometry( 4000, 4000, 4000 );
	var skybox = new THREE.Mesh( geometry, faceMaterial );	
	skybox.position.set(0,0,0);
	
	scene.add(skybox);
	
	window.addEventListener( 'resize', onWindowResize, false );	

	

	// Composer
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	effect = new THREE.ShaderPass( THREE.VergilWaterShader );
	effect.uniforms['centerX'].value = 0.8;
	effect.uniforms['centerY'].value = 0.8;
	composer.addPass( effect );
	effect2 = new THREE.ShaderPass( THREE.VergilWaterShader );
	effect2.uniforms['centerX'].value = 0.2;
	effect2.uniforms['centerY'].value = 0.2;
	composer.addPass( effect2 );
	effect3 = new THREE.ShaderPass( THREE.VergilWaterShader );
	effect3.uniforms['centerX'].value = 0.2;
	effect3.uniforms['centerY'].value = 0.8;
	composer.addPass( effect3 );
	effect4 = new THREE.ShaderPass( THREE.VergilWaterShader );
	effect4.uniforms['centerX'].value = 0.8;
	effect4.uniforms['centerY'].value = 0.2;
	effect4.renderToScreen = true;
	composer.addPass( effect4 );

	function rotateAroundWorldAxis(object, axis, radians) {
		var q = new THREE.Quaternion();

		q.setFromAxisAngle( axis, radians ); 
		object.quaternion.multiplyQuaternions( q, object.quaternion );
	}
	

	//Adding particle system
	var particles = new THREE.Geometry;
	for (var p = 0; p < 8000; p++) {
		var particle = new THREE.Vector3(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
		particles.vertices.push(particle);
	}
	var particleTexture = new THREE.TextureLoader().load('image/twinkle2.png');
	var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, map: particleTexture, size: 2 , transparent: true, blending:THREE.AdditiveBlending, fog:false});
	var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
	scene.add(particleSystem);

	
	render();
	
}

function insertpipe(){
	var smallCylinderGeom = new THREE.CylinderGeometry( Pipe_inner_diameter, Pipe_inner_diameter, Pipe_length*2, 32, 4 );
	var largeCylinderGeom = new THREE.CylinderGeometry( Pipe_outer_diameter, Pipe_outer_diameter, Pipe_length*2, 32, 4 );

	var smallCylinderBSP = new ThreeBSP(smallCylinderGeom);
	var largeCylinderBSP = new ThreeBSP(largeCylinderGeom);
	var intersectionBSP = largeCylinderBSP.subtract(smallCylinderBSP);      

	var Material = new THREE.MeshLambertMaterial( { color: pc } );
	var hollowCylinder = intersectionBSP.toMesh( Material );
	hollowCylinder.rotation.z = 1.57;
	hollowCylinder.position.set(Pipe_center_position.x,Pipe_center_position.y,Pipe_center_position.z);
	scene.add( hollowCylinder );
	
}


function insertcube(){
	var box_geometry = new THREE.BoxGeometry( Parallelepiped_x, Parallelepiped_y, Parallelepiped_z );
	var cubeMaterial = new THREE.MeshPhongMaterial({color:ppc});
	var cube = new THREE.Mesh( box_geometry, cubeMaterial );
	cube.position.set(Parallelepiped_center_position.x,Parallelepiped_center_position.y,Parallelepiped_center_position.z);

	scene.add(cube);
	
}

function onWindowResize(){
	windowHalfX = (window.innerWidth*0.75) / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = (window.innerWidth*0.75) / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( (window.innerWidth*0.75), window.innerHeight );
}


function render(){

	requestAnimationFrame( render );

	//particleSystem.rotation.y += 0.0003;
	// var pCount = particles.length;
	// while (pCount--) {

		// var particle =
		  // particles.vertices[pCount];
		// if (particle.position.y < -800) {
		  // particle.position.y = 800;
		  // particle.velocity.y = 0;
		// }
	// particle.velocity.y -= Math.random() *1;
	// particle.position.addSelf(
	  // particle.velocity);
	// }
	// particleSystem.geometry.__dirtyVertices = true;
	
	//Auto animation effect
	// effect.uniforms['time'].value += Math.random();
	// effect2.uniforms['time'].value += Math.random();
	// effect3.uniforms['time'].value += Math.random();
	// effect4.uniforms['time'].value += Math.random();
	
	controls.update();
	composer.render();
	//renderer.render(scene, camera);
};	
	
	
