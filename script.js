import * as THREE from './node_modules/three/build/three.module.js'

import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js'

import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'

import {VerticalBlurShader} from './node_modules/three/examples/jsm/shaders/VerticalBlurShader.js'

import gsap from "./node_modules/gsap/all.js"



// SCENE INTIALISATION

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x444444)

// SET OUR CAMERA 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1 , 1000)
camera.position.y  = 6
camera.position.z  = 5
camera.position.x  = 0
camera.rotation.x = - Math.PI/4
camera.rotation.y = 0
camera.lookAt(0, 0, 0 )




// SHADESR MATERIALS TESTS (for the aura above selected pieces and checked king)




// SHADERS TRY



const _VS = `

attribute float vertexDisplacement;
uniform float delta;
varying float vOpacity;
varying vec3 vUv;

void main() {
	vUv = position;
	vOpacity = vertexDisplacement;

	vec3 p = position ;

	// p.x += sin(vertexDisplacement);
	p.y += cos(vertexDisplacement);



	vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
  	gl_Position = projectionMatrix * modelViewPosition;
}
`

const _FS = `
uniform float delta;
varying float vOpacity;
varying vec3 vUv;

void main() {
	float r = 1.0 + cos(vUv.x * delta);
	float g = 1.0 + sin(delta) * 0.5;
	float b = 0.0;


	gl_FragColor = vec4(r, g , b, vOpacity);
}

`

let uniforms = {
	delta : {value : 0}
}


// ******************

const geometry = new THREE.CylinderBufferGeometry( 0.5, 0.5, 1, 64)
const shaderMaterial = new THREE.ShaderMaterial( {
	uniforms : uniforms,
	vertexShader: _VS,
	fragmentShader: _FS,
	
	// vertexShader: vertexShader(),
	// fragmentShader: fragmentShader(),
} )

const vertexDisplacement = new Float32Array(geometry.attributes.position.count)
for(let i = 0; i < vertexDisplacement.length; i+= 1)
{
	 vertexDisplacement[i] = Math.sin(i)
}

geometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1))
const normalMaterial = new THREE.MeshLambertMaterial({color : 0xff00ff})


let cylinder = new THREE.Mesh( geometry, shaderMaterial )
cylinder.position.set(0,15,0)
// scene.add( cylinder )


// ********************

console.log(cylinder)


// ********************









// CREATE THEE RENDERER

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)




// SET SPOTLIGHT TO MAKE GET LIGHTS ONLY ON THE CHESS PLATE


// ********************

// SPOTLIGHT 2


// const spotLight = new THREE.SpotLight( 0xffffff, 1 )
// spotLight.position.set( 20, 15,  -15)
// spotLight.intensity = 0.8
// spotLight.angle = 0.4
// spotLight.penumbra = 0.6
// spotLight.decay = 2
// spotLight.distance = 200

// spotLight.castShadow = true
// spotLight.shadow.mapSize.width = 512
// spotLight.shadow.mapSize.height = 512
// spotLight.shadow.camera.near = 2
// spotLight.shadow.camera.far = 200
// spotLight.shadow.focus = 1
// scene.add( spotLight )

// // const lightHelper = new THREE.SpotLightHelper( spotLight )
// // scene.add(lightHelper)


// // SPOTLIGHT 2


// const spotLight2 = new THREE.SpotLight( 0xffffff, 1 )
// spotLight2.position.set( -20, 15,  15)
// spotLight2.intensity = 1
// spotLight2.angle = 0.4
// spotLight2.penumbra = 0.6
// spotLight2.decay = 2
// spotLight2.distance = 200

// spotLight2.castShadow = true
// spotLight2.shadow.mapSize.width = 512
// spotLight2.shadow.mapSize.height = 512
// spotLight2.shadow.camera.near = 2
// spotLight2.shadow.camera.far = 200
// spotLight2.shadow.focus = 1
// scene.add( spotLight2 )

// const lightHelper2 = new THREE.SpotLightHelper( spotLight2 )
// scene.add( lightHelper2 )

// ********************



// SPOTLIGHT 3


const spotLight3 = new THREE.SpotLight( 0xffffff, 1 )
spotLight3.position.set( 0, 25,  0)
spotLight3.intensity = 1.5
spotLight3.angle = 0.6
spotLight3.penumbra = 0.6
spotLight3.decay = 2
spotLight3.distance = 200

spotLight3.castShadow = true
spotLight3.shadow.mapSize.width = 512
spotLight3.shadow.mapSize.height = 512
spotLight3.shadow.camera.near = 2
spotLight3.shadow.camera.far = 200
spotLight3.shadow.focus = 1
scene.add( spotLight3 )

// const lightHelper3 = new THREE.SpotLightHelper( spotLight3 )
// scene.add( lightHelper3 )


// CREATING THE ROOM, need to be update to make a real ambient instead of just a chess plate on the ground

const texture = new THREE.TextureLoader().load( 'ground_texture.jpg' );
const cubeSize = 60
const roomGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize)
const roomMaterial = new THREE.MeshPhongMaterial({map : texture})
const room = new THREE.Mesh( roomGeometry, roomMaterial)
room.material.side = THREE.DoubleSide
room.material.receiveShadow = true

room.position.y = cubeSize/2 -0.5

scene.add(room)



//  CREATING THE CHESS PLATE
const pieceStock = []
const chessGroup = new THREE.Group()
chessGroup.name = 'Chess Group'


// 2 LOOPS, ONE TO MAKE X AXE AND THE OTHER ONE TO MAKE THE Z AXE
for(let x = 0; x <8 ; x++)
{
	for(let z = 0; z < 8; z++)
	{
		const caseGeo = new THREE.BoxGeometry(1, 1, 1)
		const material = new THREE.MeshLambertMaterial()
		let caseColor = 0x313131

		// Make the case the right color depending of it position
		if(x%2 == 0 && z%2 == 0)
		{
			// Noir
			material.color = new THREE.Color(caseColor)
		}
		else if(x%2 != 0 && z%2 != 0)
		{
			// Noir
			material.color = new THREE.Color(caseColor)
		}
		else
		{
			caseColor = 0xffffff
			material.color = new THREE.Color(caseColor)
			
		}
		//  Create the mesh of the case and place it in the scene
		const chessCase = new THREE.Mesh(caseGeo, material)
		chessCase.position.x = x
		chessCase.position.z = z 
		chessCase.material.receiveShadow = true
		chessCase.material.receiveshadow = true

		//  Give it a data to bea bale to get it position and other things easyli 
		const caseData = {
			occuped : false,
			posX : x,
			posZ : z,
			caseColor : caseColor,
			pieceColor : '',
			type : ''
		}
		chessCase.type = 'case'
		chessCase.userData = caseData
		scene.add(chessCase)
		chessGroup.add(chessCase)
	}
}

//  Set the gltf loader to load our 3d model of chess pieces
const loader = new GLTFLoader();


//  Create vars for both of the kings because you need to have access to them each round to check if there is a checkmate or not
let blackKing, whiteKing


//  Create a function to init all our pieces for black and white and position on the plate
const pieceInit = (pieceColor, posZ, pieceCodeColor, knightRotation) =>
{
	// Create only one material for every pieces and give it to all of them
	const pieceMaterial = new THREE.MeshPhysicalMaterial( {
		color: pieceCodeColor,
		metalness: 0,
		roughness: 0,
		alphaTest: 0.5,
		envMap: texture,
		envMapIntensity: 1,
		depthWrite: false,
		clearcoat : 0.4 ,
		transmission: 0.2, // use material.transmission for glass materials
		opacity: 1, // set material.opacity to 1 when material.transmission is non-zero
		transparent: true
	} )
	// PAWN
	let pawnPosZ

	if(posZ == 0 )
	{
		pawnPosZ = 1
	}
	else if(posZ == 7)
	{
		pawnPosZ = 6
	}
	for(let x  = 0; x< 8 ; x ++)
	{


		// Load the models of the piece, give it a material, place them on the palte, give it all the data  and add it to the scene. Globaly repaet the process for every piece and just change the values
		loader.load( 'chess_pieces/pawn.glb', function ( gltf ) {
			const pawn = gltf.scene.children[0]
			pawn.scale.set(0.05, 0.05, 0.05)
			// down scale them to have them to the right size then get their size in the scene to place the bottom of the piece exactly at the top edge of the chess plate
			const boundingBox = new THREE.Box3().setFromObject(pawn)
			const size = boundingBox.getSize()
			pawn.userData = {
				posX : x,
				posZ : pawnPosZ,
				posY : 1 + size.y/2 - 0.49,
				color : pieceColor,
				colorCode : pieceCodeColor,
				piece : 'pawn',
				type : 'piece'
			}
			pawn.material = pieceMaterial
			pawn.position.x = x
			//  Set the good y positon for the piece
			pawn.position.y = 1 + size.y/2 - 0.49
			pawn.position.z = pawnPosZ,
			pawn.type = 'piece'
			pieceStock.push(pawn)
			scene.add(pawn)
			chessGroup.add(pawn)
		})

	}


	// ROOK

	loader.load( 'chess_pieces/rook.glb', function ( gltf ) {
		const leftRook = gltf.scene.children[0]
		leftRook.scale.set(0.4, 0.4, 0.4)
		const boundingBox = new THREE.Box3().setFromObject(leftRook)
		const size = boundingBox.getSize()
		leftRook.userData = {
			posX : 0,
			posZ : posZ,
			posY : 1 + size.y/2 - 0.49,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'rook',
			type : 'piece'
		}
		leftRook.material = pieceMaterial
		leftRook.position.x = 0
		leftRook.position.y = 1 + size.y/2 - 0.49
		leftRook.position.z = posZ
		leftRook.type = 'piece'
		pieceStock.push(leftRook)
		scene.add(leftRook)
		chessGroup.add(leftRook)
	})

	loader.load( 'chess_pieces/rook.glb', function ( gltf ) {
		const rightRook = gltf.scene.children[0]
		rightRook.scale.set(0.4, 0.4, 0.4)
		const boundingBox = new THREE.Box3().setFromObject(rightRook)
		const size = boundingBox.getSize()
		rightRook.userData = {
			posX : 7,
			posZ : posZ,
			posY : 1 + size.y/2 - 0.49,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'rook',
			type : 'piece'
		}
		rightRook.material = pieceMaterial
		rightRook.position.x = 7
		rightRook.position.y = 1 + size.y/2 - 0.49
		rightRook.position.z = posZ
		rightRook.type = 'piece'
		pieceStock.push(rightRook)
		scene.add(rightRook)
		chessGroup.add(rightRook)
	})


	// KNIGHT


	loader.load( 'chess_pieces/knight.glb', function ( gltf ) {
		const leftKnight = gltf.scene.children[0]
		leftKnight.scale.set(0.7, 0.7, 0.7)
		const boundingBox = new THREE.Box3().setFromObject(leftKnight)
		const size = boundingBox.getSize()
		leftKnight.userData = {
			posX : 1,
			posZ : posZ,
			posY : 1 + size.y/2 - 0.49,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'knight',
			type : 'piece'
		}
		leftKnight.material = pieceMaterial
		leftKnight.position.x = 1
		leftKnight.position.y =  1 + size.y/2 - 0.49
		leftKnight.position.z = posZ
		leftKnight.rotation.z += knightRotation
		leftKnight.type = 'piece'
		pieceStock.push(leftKnight)
		scene.add(leftKnight)
		chessGroup.add(leftKnight)
	})



	loader.load( 'chess_pieces/knight.glb', function ( gltf ) {
		const rightKnight = gltf.scene.children[0]
		rightKnight.scale.set(0.7, 0.7, 0.7)
		const boundingBox = new THREE.Box3().setFromObject(rightKnight)
		const size = boundingBox.getSize()
		rightKnight.userData = {
			posX : 6,
			posZ : posZ,
			posY : 1 + size.y/2 - 0.49,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'knight',
			type : 'piece'
		}
		rightKnight.material = pieceMaterial
		rightKnight.position.x = 6
		rightKnight.position.y = 1 + size.y/2 - 0.49
		rightKnight.position.z = posZ
		rightKnight.rotation.z += knightRotation
		rightKnight.type = 'piece'
		pieceStock.push(rightKnight)
		scene.add(rightKnight)
		chessGroup.add(rightKnight)
	})
	


	// BISHOP

	loader.load( 'chess_pieces/bishop.glb', function ( gltf ) {
		const leftBishop = gltf.scene.children[0]
		leftBishop.scale.set(0.11, 0.11, 0.11)
		const boundingBox = new THREE.Box3().setFromObject(leftBishop)
		const size = boundingBox.getSize()
		leftBishop.userData = {
			posX : 2,
			posZ : posZ,
			posY : 1 + size.y/2 - 0.49,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'bishop',
			type : 'piece'
		}
		leftBishop.material = pieceMaterial
		leftBishop.position.x = 2
		leftBishop.position.y = 1 + size.y/2 - 0.49
		leftBishop.position.z = posZ
		leftBishop.type = 'piece'
		pieceStock.push(leftBishop)
		scene.add(leftBishop)
		chessGroup.add(leftBishop)
	})
	



	loader.load( 'chess_pieces/bishop.glb', function ( gltf ) {
		const rightBishop = gltf.scene.children[0]
		rightBishop.scale.set(0.11, 0.11, 0.11)
		const boundingBox = new THREE.Box3().setFromObject(rightBishop)
		const size = boundingBox.getSize()
		rightBishop.userData = {
			posX : 5,
			posY : 1 + size.y/2 - 0.49,
			posZ : posZ,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'bishop',
			type : 'piece'
		}
		rightBishop.material = pieceMaterial
		rightBishop.position.x = 5
		rightBishop.position.y = 1 + size.y/2 - 0.49
		rightBishop.position.z = posZ
		rightBishop.type = 'piece'
		pieceStock.push(rightBishop)
		scene.add(rightBishop)
		chessGroup.add(rightBishop)
	})



	// KING

	// loader.load( 'chess_pieces/king.glb', function ( gltf ) {
	// 	const king = gltf.scene.children[0]
	// 	king.scale.set(0.4, 0.4, 0.4)
	// 	const boundingBox = new THREE.Box3().setFromObject(king)
	// 	const size = boundingBox.getSize()
	// 	king.userData = {
	// 		posX : 3,
	// 		posZ : posZ,
	// 		posY : 1 + size.y/2 - 0.49,
	// 		color : pieceColor,
	// 		colorCode : pieceCodeColor,
	// 		piece : 'king',
	// 		type : 'piece'
	// 	}
	// 	king.material = pieceMaterial
	// 	king.position.x = 3
	// 	king.position.y = 1 + size.y/2 - 0.49
	// 	king.position.z = posZ
	// 	king.type = 'piece'
	// 	pieceStock.push(king)
	// 	scene.add(king)
	// 	chessGroup.add(king)
	// })

	const kingGeometry = new THREE.CylinderGeometry(0.4,0.4,1)
	const kingMaterial = pieceMaterial
	const king = new THREE.Mesh(kingGeometry, kingMaterial)
	king.userData = {
		posX : 3,
		posZ : posZ,
		posY : 1,
		color : pieceColor,
		colorCode : pieceCodeColor,
		piece : 'king',
		type : 'piece'
	}
	if(pieceColor == 'black')
		blackKing = king
	if(pieceColor == 'white')
		whiteKing = king
	king.position.x = 3
	king.position.y = 1
	king.position.z = posZ
	king.type = 'piece'
	pieceStock.push(king)
	scene.add(king)
	chessGroup.add(king)
	

	// QUEEN

	loader.load( 'chess_pieces/queen.glb', function ( gltf ) {
		const queen = gltf.scene.children[0]
		queen.scale.set(0.4, 0.4, 0.4)
		const boundingBox = new THREE.Box3().setFromObject(queen)
		const size = boundingBox.getSize()
		queen.userData = {
			posX : 4,
			posZ : posZ,
			posY : 1 + size.y/2 - 0.49,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'queen',
			type : 'piece'
		}
		queen.material = pieceMaterial
		queen.position.x = 4
		queen.position.y = 1 + size.y/2 - 0.49
		queen.position.z = posZ
		queen.type = 'piece'
		pieceStock.push(queen)
		scene.add(queen)
		chessGroup.add(queen)
	})
}

//  Call our piece init function for balack and white
pieceInit('black', 0, 0x444444, Math.PI*2)
pieceInit('white', 7, 0xffffff, Math.PI)
//  recenter all our objects
chessGroup.position.x = -3.5
chessGroup.position.z = -3.5
scene.add(chessGroup)

//  INTERACTIONS


//  Set a raycaster to determine the click on the pieces or on the plate to know which object is hit by the ray 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


//  Orbite controls just to be able to naviguate in the scene if i need

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.maxDistance = cubeSize / 2 
// controls.maxPolarAngle = Math.PI / 2.2
// controls.minDistance = 7

//  Create a Var about the player turn to know wich player has to play 
let playerTurn = 'white'

// The Loop which manage our animations like the camera that always look at the middle of the scene or lunch the ray in the scene on every frame and render our scene 
const animate = () =>
{
	requestAnimationFrame(animate)
	renderer.render(scene,camera)
	raycaster.setFromCamera( mouse, camera )
	camera.lookAt(0, 0, 0)
}
animate()



//  Make a var to know which piece the player clicked on to play
let pieceSelected = 0




// Listen the click player to knwo what he want to do 
window.addEventListener('click', (event) =>
{

	console.clear()
	//  get our mouse position to know on which element we clicked
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
	raycaster.setFromCamera( mouse, camera )
	//  get all the objects that the ray has it
	const intersects = raycaster.intersectObjects( chessGroup.children )


	//  Stock the first object that the ray hit and stock it in piece selected if the object is a piece
	if(intersects[0].object.type =='piece')
	{
		pieceSelection(intersects[0].object)
	}
	else if(pieceSelected != 0)
	{
		gsap.to(selectionCyldinder.material, {transmission : 1, duration : 0.3})
	}

	//  If the player has hit a case, it normaly meansd that's he has selected a piece
	if(intersects[0].object.type == 'case')
	{
		//  Call a move function depending of which piece the player has selected
		if(pieceSelected.userData.piece == 'pawn')
		{
			pawnMove(intersects[0].object)
		}

		if(pieceSelected.userData.piece == 'rook')
		{
			rookMove(intersects[0].object)
		}

		if(pieceSelected.userData.piece == 'knight')
		{
			knightMove(intersects[0].object)
		}

		if(pieceSelected.userData.piece == 'bishop')
		{
			bishopMove(intersects[0].object)
		}

		if(pieceSelected.userData.piece == 'queen')
		{
			queenMove(intersects[0].object)

		}

		if(pieceSelected.userData.piece == 'king')
		{
			kingMove(intersects[0].object)
		}

		// Reset the selection 
		if (pieceSelected != 0)
		{
			pieceSelected = 0
		}
	}
})


// Shape that show which piece is currently selected ----> SHoudl be like an aura when i'll learn shaders correctly
const selectionCyldinder = new THREE.Mesh(
	new THREE.CylinderBufferGeometry(0.4, 0.4, 0.5),
	new THREE.MeshPhysicalMaterial({
		color: 0xececec,
		transmission: 1, // use material.transmission for glass materials
		opacity: 1, // set material.opacity to 1 when material.transmission is non-zero
		transparent: true})
)

selectionCyldinder.position.set(0,3,0)
scene.add(selectionCyldinder)

const pieceSelection = (object) =>
{
	//  If a piece is already selected we deslecte it to select a new one just after
	if(pieceSelected !=0)
	{
		pieceSelected = 0

	}
	//  Stock the new selected piece
	if(pieceSelected == 0 && object.userData.color == playerTurn)
	{
		pieceSelected = object
		gsap.to(selectionCyldinder.material, {transmission : 0.2, duration : 0.3, delay : 0.3})
		gsap.to(selectionCyldinder.position, {x :pieceSelected.userData.posX - 3.5 ,y : 3 ,z :pieceSelected.userData.posZ - 3.5 , duration : 0.3})

		console.log(pieceSelected)
	}
}

//  Function to make the turns alternates between the two players


const turnAlternate = () =>
{
	//  Call the king checkmate function on every round to see if the turn put the king in check or not and make the camera move
	kingCheckMate(whiteKingCheck)
	kingCheckMate(blackKingCheck)

	//  Make the truns alternate and animate the camera
	if(playerTurn == 'white')
	{
		playerTurn = 'black'
		const tl = gsap.timeline()
		tl.to(camera.position, {z : 0, x : 4, duration : 0.5})
		.to(camera.position, {z : -5, x : 0,  duration : 0.5, delay : 0.7})


	}
	else if(playerTurn == 'black')
	{
		playerTurn = 'white'
		const tl = gsap.timeline()
		tl.to(camera.position, {z : 0, x : 4, duration : 0.5})
		.to(camera.position, {z : 5, x: 0 ,duration : 0.5, delay : 0.7})

	}
}
//  FUNCTION to know if the case clicked is free for the piece or not
const caseFree = (caseClicked) =>
{
	for(let i  = 0; i< pieceStock.length; i ++)
	{
		if(pieceStock[i].userData.posX == caseClicked.userData.posX && pieceStock[i].userData.posZ == caseClicked.userData.posZ && pieceSelected.userData.color == pieceStock[i].userData.color)
		{
			
			return false
		}
		if(pieceStock[i].userData.posX == caseClicked.userData.posX && pieceStock[i].userData.posZ == caseClicked.userData.posZ && pieceSelected.userData.piece == 'pawn')
			{
				return false
			}
	}
	return true
}


//  If a piece go on a case occuped by an ennemie piece, the piece eat this one and delete it from the game
const eatPiece = (caseClicked) =>
{
	for(let i  = 0; i< pieceStock.length; i ++)
	{
		if(pieceStock[i].userData.posX == caseClicked.userData.posX && pieceStock[i].userData.posZ == caseClicked.userData.posZ && pieceSelected.userData.color != pieceStock[i].userData.color)
		{
			chessGroup.remove(pieceStock[i])
			pieceStock.splice(i, 1)
		}
	}
}

//  Special pawn eat function becasue they don't eat like they move
const pawnEatPiece = (caseClicked) =>
{
	for(let i  = 0; i< pieceStock.length; i ++)
	{
		if(pieceStock[i].userData.posX == caseClicked.userData.posX && pieceStock[i].userData.posZ == caseClicked.userData.posZ && pieceSelected.userData.color != pieceStock[i].userData.color)
		{
			return true
		}
	}
	return false
}

//  All the move function works the same way, Check if the case that's has been clicked is able to reach for the reach, if yes we call the checkmove function to be sure if there is no piece on the way 

const pawnMove = (caseClicked) =>
{
	let pawnDirection
	let pawnStart 
	if(pieceSelected.userData.color == 'black')
	{
		
		pawnDirection = 1
		pawnStart = 1
	}

	if(pieceSelected.userData.color == 'white')
	{
		pawnDirection = -1
		pawnStart = 6

	}
	if(caseClicked.userData.posZ - pieceSelected.position.z == pawnDirection && caseClicked.userData.posX == pieceSelected.position.x)
	{
		if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				animationMove(caseClicked)
				turnAlternate()
				return true
			}
	}
	else if(caseClicked.userData.posZ  - pieceSelected.position.z == pawnDirection * 2 && pieceSelected.position.z  == pawnStart && caseClicked.userData.posX == pieceSelected.position.x)
	{
		if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				animationMove(caseClicked)
				turnAlternate()
				return true
			}

	}
	if(pawnEatPiece(caseClicked) && caseClicked.userData.posZ - pieceSelected.userData.posZ == pawnDirection && pieceSelected.userData.posX - caseClicked.userData.posX == 1 ||
		pawnEatPiece(caseClicked) && caseClicked.userData.posZ - pieceSelected.userData.posZ == pawnDirection && pieceSelected.userData.posX - caseClicked.userData.posX == -1)
		{
			if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				eatPiece(caseClicked)
				animationMove(caseClicked)
				turnAlternate()
				return true
			}
		}
}

//  CheckMove functions are used to check if there 's no piece on the piece way
const rookCheckMove  = (caseClicked) =>
{
	// VERTICAL
	if(caseClicked.userData.posX == pieceSelected.userData.posX)
	{
		if(pieceSelected.userData.posZ  - caseClicked.userData.posZ < 0)
		{
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let  u = pieceSelected.userData.posZ + 1; u < caseClicked.userData.posZ ; u++)
				{
					if(u == pieceStock[i].userData.posZ && pieceSelected.userData.posX == pieceStock[i].userData.posX)
					{
						return false
					}
				}
			}
		}
		if(pieceSelected.userData.posZ  - caseClicked.userData.posZ > 0)
		{
			
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let u = pieceSelected.userData.posZ - 1; u > caseClicked.userData.posZ ; u--)
				{
					if(u == pieceStock[i].userData.posZ && pieceSelected.userData.posX == pieceStock[i].userData.posX)
					{
						return false
					}
				}
			}
		}
	}

	// HORIZONTAL
	if(caseClicked.userData.posZ == pieceSelected.userData.posZ)
	{
		if(pieceSelected.userData.posX  - caseClicked.userData.posX < 0)
		{
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let  u = pieceSelected.userData.posX + 1; u < caseClicked.userData.posX ; u++)
				{
					if(u == pieceStock[i].userData.posX && pieceSelected.userData.posZ == pieceStock[i].userData.posZ)
					{
						return false
					}
				}
			}
		}
		if(pieceSelected.userData.posX  - caseClicked.userData.posX > 0)
		{
			
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let u = pieceSelected.userData.posX - 1; u > caseClicked.userData.posX ; u--)
				{
					if(u == pieceStock[i].userData.posX && pieceSelected.userData.posZ == pieceStock[i].userData.posZ)
					{
						return false
					}
				}
			}
		}
	}
	return true

}

// for(let i = 6; i)
const rookMove = (caseClicked) =>
{
	if(pieceSelected.position.x == caseClicked.userData.posX)
	{
		if(rookCheckMove(caseClicked))
		{
			if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				eatPiece(caseClicked)
				animationMove(caseClicked)
				turnAlternate()
				return true
			}
		}
	}
	else if(pieceSelected.position.z == caseClicked.userData.posZ)
	{
		if(rookCheckMove(caseClicked))
		{
			if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				eatPiece(caseClicked)
				animationMove(caseClicked)
				turnAlternate()
				return true
			}
		}

	}
	
}


const knightMove = (caseClicked) =>
{
	if(caseClicked.userData.posX - pieceSelected.userData.posX == 2 || caseClicked.userData.posX - pieceSelected.userData.posX == -2)
	{
		if(caseClicked.userData.posZ - pieceSelected.userData.posZ == 1 || caseClicked.userData.posZ - pieceSelected.userData.posZ == -1)
		{
			if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				eatPiece(caseClicked)
				animationMove(caseClicked)
				turnAlternate()
				return true
			}
		}
	}
	if(caseClicked.userData.posZ - pieceSelected.userData.posZ == 2 || caseClicked.userData.posZ - pieceSelected.userData.posZ == -2)
	{
		if(caseClicked.userData.posX - pieceSelected.userData.posX == 1 || caseClicked.userData.posX - pieceSelected.userData.posX == -1)
		{
			if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				eatPiece(caseClicked)
				animationMove(caseClicked)
				turnAlternate()
				return true
			}
		}
	}
}

const bishopCheckMove = (caseClicked) =>
{

	if( caseClicked.userData.posX - pieceSelected.userData.posX >0 && caseClicked.userData.posZ - pieceSelected.userData.posZ > 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceSelected.userData.posX + 1; u <caseClicked.userData.posX ;u ++ )
		{
			lineX.push(u)
		}
		for(let u = pieceSelected.userData.posZ + 1; u <caseClicked.userData.posZ ;u ++ )
		{
			lineZ.push(u)
		}

		for(let i = 0; i < pieceStock.length ; i++)
		{
			for(let u = 0; u < lineX.length; u++)
			{
				if(pieceStock[i].userData.posX == lineX[u] && pieceStock[i].userData.posZ == lineZ[u])
				{
					return false
				}
			}
		}
	}

	if( caseClicked.userData.posX - pieceSelected.userData.posX < 0 && caseClicked.userData.posZ - pieceSelected.userData.posZ < 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceSelected.userData.posX - 1; u >caseClicked.userData.posX ;u -- )
		{
			lineX.push(u)
		}
		for(let u = pieceSelected.userData.posZ - 1; u >caseClicked.userData.posZ ;u --)
		{
			lineZ.push(u)
		}
		for(let i = 0; i < pieceStock.length ; i++)
		{
			for(let u = 0; u < lineX.length; u++)
			{
				if(pieceStock[i].userData.posX == lineX[u] && pieceStock[i].userData.posZ == lineZ[u])
				{
					return false
				}
			}
		}
	}
	if( caseClicked.userData.posX - pieceSelected.userData.posX < 0 && caseClicked.userData.posZ - pieceSelected.userData.posZ > 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceSelected.userData.posX - 1; u >caseClicked.userData.posX ;u -- )
		{
			lineX.push(u)
		}
		for(let u = pieceSelected.userData.posZ  + 1; u < caseClicked.userData.posZ ;u ++)
		{
			lineZ.push(u)
		}
		for(let i = 0; i < pieceStock.length ; i++)
		{
			for(let u = 0; u < lineX.length; u++)
			{
				if(pieceStock[i].userData.posX == lineX[u] && pieceStock[i].userData.posZ == lineZ[u])
				{
					return false
				}
			}
		}
	}
	if( caseClicked.userData.posX - pieceSelected.userData.posX > 0 && caseClicked.userData.posZ - pieceSelected.userData.posZ < 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceSelected.userData.posX + 1; u < caseClicked.userData.posX ;u ++ )
		{
			lineX.push(u)
		}
		for(let u = pieceSelected.userData.posZ  - 1; u > caseClicked.userData.posZ ;u --)
		{
			lineZ.push(u)
		}
		for(let i = 0; i < pieceStock.length ; i++)
		{
			for(let u = 0; u < lineX.length; u++)
			{
				if(pieceStock[i].userData.posX == lineX[u] && pieceStock[i].userData.posZ == lineZ[u])
				{
					return false
				}
			}
		}
	}
	return true
}


const bishopMove = (caseClicked) =>
{
	if(caseClicked.userData.posX - pieceSelected.userData.posX == caseClicked.userData.posZ - pieceSelected.userData.posZ ||
	-(caseClicked.userData.posX - pieceSelected.userData.posX) == caseClicked.userData.posZ - pieceSelected.userData.posZ ||
	-(caseClicked.userData.posX - pieceSelected.userData.posX) == -(caseClicked.userData.posZ - pieceSelected.userData.posZ) ||
	caseClicked.userData.posX - pieceSelected.userData.posX == -(caseClicked.userData.posZ - pieceSelected.userData.posZ) )
	{
		if(bishopCheckMove(caseClicked))
		{
			if(caseClicked.userData.type != 'piece' && caseFree(caseClicked))
			{

				eatPiece(caseClicked)
				animationMove(caseClicked)
				turnAlternate()
				return true
			}
		}
	}
}

const queenMove = (caseClicked) =>
{
	bishopMove(caseClicked)
	rookMove(caseClicked)
}

const kingMove = (caseClicked) =>
{
	if(pieceSelected.userData.posX - caseClicked.userData.posX >= -1 && pieceSelected.userData.posX - caseClicked.userData.posX <= 1 &&
								pieceSelected.userData.posZ - caseClicked.userData.posZ >= -1 && pieceSelected.userData.posZ - caseClicked.userData.posZ <= 1 && caseFree(caseClicked))
	{
		eatPiece(caseClicked)
		animationMove(caseClicked)
		turnAlternate()
		return true
	}
}

// Short function to make the pieces animate when they move by using gsap and udpate pieces datas
const animationMove = (caseClicked) =>
{ 
	pieceSelected.userData.posZ = caseClicked.userData.posZ 
	pieceSelected.userData.posX = caseClicked.userData.posX 

	gsap.to(pieceSelected.position, { x : caseClicked.userData.posX, z : caseClicked.userData.posZ, duration : 0.8})

}


//  Function to check if the king is in check (Not already fully functinal)
let whiteKingCheck = {
	element : whiteKing,
	isChecked : false,
	color : 'white'
}
let blackKingCheck = {
	element : blackKing,
	isChecked : false,
	color : 'black'
}
const kingCheckMate = (king) =>
{
	for(let i = 0; i < pieceStock.length; i++)
	{
			
			if(pieceStock[i].userData.piece == 'queen' && pieceStock[i].userData.color != king.color)
			{
				
			}
		
	}
}

