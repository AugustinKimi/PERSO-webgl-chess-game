import * as THREE from './node_modules/three/build/three.module.js'

import { GLTFLoader } from './node_modules/three/examples/jsm/Loaders/GLTFLoader.js'

import Stats from './node_modules/three/examples/jsm/libs/stats.module.js'


import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'


import gsap from "./node_modules/gsap/all.js"
import Power0 from './node_modules/gsap/gsap-core.js'
import { Timeline } from './node_modules/gsap/gsap-core.js'

const playButton = document.querySelector('.button')
const container = document.querySelector('.container')

// playButton.addEventListener('click', () =>
// {
// 	container.style.opacity = '0'
// 	gsap.to(camera.position, {x : 0, z: 4, duration : 2, delay : 0})
// 	setTimeout(() => {
// 		container.remove()
// 	}, 400);
// })



const stats = new Stats()
document.body.appendChild(stats.dom)



// SCENE INTIALISATION

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x444444)

// scene.fog = new THREE.Fog(0xffffff, 5,100)
// CREATE THEE RENDERER

const renderer = new THREE.WebGLRenderer({antialias : true})
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


// SET OUR CAMERA 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1 , 1000)
camera.position.y  = 20
camera.position.z  = 40
camera.position.x  = -20
camera.rotation.x = - Math.PI/4
camera.rotation.y = 0



window.addEventListener('resize', () =>
{
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})
//  Orbite controls just to be able to naviguate in the scene if i need

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.target = new THREE.Vector3(0, 13, 0)
// controls.maxDistance = 60 / 2 
// controls.maxPolarAngle = Math.PI / 2.2
// controls.minDistance = 7
camera.lookAt(0, 12, 0)

//  Set a raycaster to determine the click on the pieces or on the plate to know which object is hit by the ray 
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()


//  CAMERA PATH

const cameraPath = new THREE.CatmullRomCurve3([
	new THREE.Vector3( 30   ,  20   ,  30),
	new THREE.Vector3(-15  ,  20   ,  15),
	// new THREE.Vector3( 30   ,  20   ,  -30),
	// new THREE.Vector3( -30   ,  20   ,  -30),
	new THREE.Vector3( -5   ,  20   ,  0)
])

let camPosIndex = 0
const cameraSpeed = 300
let start = false

setTimeout(() => {
	start = true
}, 4000);

// The Loop which manage our animations like the camera that always look at the middle of the scene or lunch the ray in the scene on every frame and render our scene 
const animate = () =>
{
	
	if(camPosIndex < cameraSpeed && start)
	{
		camPosIndex++;
		const camPos = cameraPath.getPoint(camPosIndex / cameraSpeed)
		camera.position.x = camPos.x;
		camera.position.y = camPos.y;
		camera.position.z = camPos.z;
	}

	requestAnimationFrame(animate)
	renderer.render(scene,camera)
	raycaster.setFromCamera( mouse, camera )
	stats.update()
	camera.lookAt(0, 12, 0)
}
animate()



// SET SPOTLIGHT TO MAKE GET LIGHTS ONLY ON THE CHESS PLATE

const ambientlight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientlight)


// // SPOTLIGHT 
const rightSpotLight = new THREE.SpotLight( 0xffffff, 1 )
rightSpotLight.position.set( 0, 30,  0)
rightSpotLight.angle = 0.9
rightSpotLight.penumbra = 0.6
rightSpotLight.decay = 2
rightSpotLight.distance = 200
rightSpotLight.target.position.set(0,12,0)
scene.add(rightSpotLight.target)

rightSpotLight.castShadow = true
rightSpotLight.shadow.mapSize.width = 5096
rightSpotLight.shadow.mapSize.height = 5096
rightSpotLight.shadow.camera.near = 2
rightSpotLight.shadow.camera.far = 200
rightSpotLight.shadow.focus = 1

scene.add( rightSpotLight )

// const leftSpotLight = new THREE.SpotLight( 0xffffff, 0.8 )
// leftSpotLight.position.set( -15, 40,  0)
// leftSpotLight.angle = 0.6
// leftSpotLight.penumbra = 0.6
// leftSpotLight.decay = 2
// leftSpotLight.distance = 200


// scene.add( leftSpotLight )

// const lightHelper = new THREE.SpotLightHelper( rightSpotLight )
// scene.add( lightHelper )

// const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
// dirLight.position.set(5,25,0)
// dirLight.target.position.set(0, 15, 0)

// dirLight.castShadow = true
// dirLight.shadow.mapSize.width = 1024
// dirLight.shadow.mapSize.height = 1024
// dirLight.shadow.camera.near = 1
// dirLight.shadow.camera.far = 100
// dirLight.shadow.focus = 1


// console.log(dirLight)
// scene.add(dirLight)
// scene.add(dirLight.target)
// const dirLightTarget = new THREE.Object3D()
// dirLightTarget.position.set(0,40,0)
// scene.add(dirLightTarget)
// console.log(dirLight.target)


// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 2)
// scene.add(dirLightHelper)



//  Set the gltf objectLoader to load our 3d model of chess pieces
const objectLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader()
const tableTextureCol = textureLoader.load('ressources/textures/table_textures/table_texture_col.jpg')
const tableTextureDisp = textureLoader.load('ressources/textures/table_textures/table_texture_disp.jpg')
const tableTextureDisp16 = textureLoader.load('ressources/textures/table_textures/table_texture_disp16.tif')
const tableTextureGloss = textureLoader.load('ressources/textures/table_textures/table_texture_gloss.jpg')
const tableTextureNrm = textureLoader.load('ressources/textures/table_textures/table_texture_nrm.jpg')
const tableTextureRefl = textureLoader.load('ressources/textures/table_textures/table_texture_refl.jpg')


objectLoader.load( 'ressources/3d_models/table.glb', function ( gltf ) {
	const table = gltf.scene.children[0]
	const tableMaterial = new THREE.MeshPhongMaterial({map : tableTextureCol, normalMap : tableTextureNrm, emissiveMap : tableTextureGloss, displacementMap : tableTextureDisp16, specularMap : tableTextureRefl})
	table.material = tableMaterial
	table.scale.set(50, 50, 30)
	// down scale them to have them to the right size then get their size in the scene to place the bottom of the piece exactly at the top edge of the chess plate
	const boundingBox = new THREE.Box3().setFromObject(table)
	const size = boundingBox.getSize()
	table.position.x = 0
	//  Set the good y positon for the piece
	table.position.y = size.y/2 - 1.5
	table.position.z = 0
	table.castShadow = true 
	table.receiveShadow = true
	scene.add(table)
})

objectLoader.load( 'ressources/3d_models/lamp.glb', function ( gltf ) {
	const lamp = gltf.scene.children[0]
	lamp.material = new THREE.MeshPhongMaterial({color : 0x111111})
	lamp.scale.set(1, 1, 1)
	lamp.position.x = 0
	//  Set the good y positon for the piece
	lamp.position.y = 30
	lamp.position.z = 0
	lamp.castShadow = true 
	lamp.receiveShadow = true
	scene.add(lamp)
})
// CREATING THE ROOM, need to be update to make a real ambient instead of just a chess plate on the ground

const roomMaterial = new THREE.MeshPhongMaterial({color : 0x444444})
const roomGeometry = new THREE.BoxGeometry(90,60,100)
const room = new THREE.Mesh( roomGeometry, roomMaterial)
room.material.side = THREE.DoubleSide
room.receiveShadow = true

room.position.y =  60/2 -0.5

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
		chessCase.castShadow = true
		chessCase.receiveShadow = true
		chessCase.userData = caseData
		scene.add(chessCase)
		chessGroup.add(chessCase)
	}
}

const sideChessPlateHeight = 0.6
const sideChessPlate = new THREE.Mesh( new THREE.BoxGeometry(10, sideChessPlateHeight, 10), new THREE.MeshLambertMaterial({color : 0x222222}))
sideChessPlate.position.set(0,1 + sideChessPlateHeight/2 - 0.5 + 10.5,0)
sideChessPlate.castShadow = true
sideChessPlate.receiveShadow = true
scene.add(sideChessPlate)



//  Create vars for both of the kings because you need to have access to them each round to check if there is a checkmate or not

let whiteKingCheck,blackKingCheck


//  Create a function to init all our pieces for black and white and position on the plate
const pieceInit = (pieceColor, posZ, pieceCodeColor, knightRotation) =>
{
	// Create only one material for every pieces and give it to all of them
	const pieceMaterial = new THREE.MeshLambertMaterial( {color: pieceCodeColor} )

	// new THREE.MeshPhysicalMaterial( {
	// 	color: pieceCodeColor,
	// 	metalness: 0,
	// 	roughness: 0,
	// 	alphaTest: 0.5,
	// 	envMap: texture,
	// 	envMapIntensity: 1,
	// 	depthWrite: false,
	// 	clearcoat : 1 ,
	// 	transmission: 0, // use material.transmission for glass materials
	// 	opacity: 1, // set material.opacity to 1 when material.transmission is non-zero
	// 	transparent: true
	// } )

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
		objectLoader.load( 'ressources/new_chess_pieces/pawn.glb', function ( gltf ) {
			const pawn = gltf.scene.children[0]
			pawn.scale.set(0.18, 0.18, 0.18)
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
			pawn.castShadow = true
			pawn.receiveShadow = true
			pawn.type = 'piece'
			pieceStock.push(pawn)
			scene.add(pawn)
			chessGroup.add(pawn)
		})

	}


	// ROOK

	objectLoader.load( 'ressources/new_chess_pieces/rook.glb', function ( gltf ) {
		const leftRook = gltf.scene.children[0]
		leftRook.scale.set(0.18, 0.18, 0.18)
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
		leftRook.castShadow = true
		leftRook.receiveShadow = true
		pieceStock.push(leftRook)
		scene.add(leftRook)
		chessGroup.add(leftRook)
	})

	objectLoader.load( 'ressources/new_chess_pieces/rook.glb', function ( gltf ) {
		const rightRook = gltf.scene.children[0]
		rightRook.scale.set(0.18, 0.18, 0.18)
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
		rightRook.castShadow = true
		rightRook.receiveShadow = true
		pieceStock.push(rightRook)
		scene.add(rightRook)
		chessGroup.add(rightRook)
	})


	// KNIGHT


	objectLoader.load( 'ressources/new_chess_pieces/knight.glb', function ( gltf ) {
		const leftKnight = gltf.scene.children[0]
		leftKnight.scale.set(0.18, 0.18, 0.18)
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
		leftKnight.rotation.y += knightRotation
		leftKnight.type = 'piece'
		leftKnight.castShadow = true
		leftKnight.receiveShadow = true
		pieceStock.push(leftKnight)
		scene.add(leftKnight)
		chessGroup.add(leftKnight)
	})



	objectLoader.load( 'ressources/new_chess_pieces/knight.glb', function ( gltf ) {
		const rightKnight = gltf.scene.children[0]
		rightKnight.scale.set(0.18, 0.18, 0.18)
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
		rightKnight.rotation.y += knightRotation
		rightKnight.type = 'piece'
		rightKnight.castShadow = true
		rightKnight.receiveShadow = true
		pieceStock.push(rightKnight)
		scene.add(rightKnight)
		chessGroup.add(rightKnight)
	})
	


	// BISHOP

	objectLoader.load( 'ressources/new_chess_pieces/bishop.glb', function ( gltf ) {
		const leftBishop = gltf.scene.children[0]
		leftBishop.scale.set(0.18, 0.18, 0.18)
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
		leftBishop.castShadow = true
		leftBishop.receiveShadow = true
		pieceStock.push(leftBishop)
		scene.add(leftBishop)
		chessGroup.add(leftBishop)
	})
	



	objectLoader.load( 'ressources/new_chess_pieces/bishop.glb', function ( gltf ) {
		const rightBishop = gltf.scene.children[0]
		rightBishop.scale.set(0.18, 0.18, 0.18)
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
		rightBishop.castShadow = true
		rightBishop.receiveShadow = true
		pieceStock.push(rightBishop)
		scene.add(rightBishop)
		chessGroup.add(rightBishop)
	})



	// KING

	objectLoader.load( 'ressources/new_chess_pieces/king.glb', function ( gltf ) {
		const king = gltf.scene.children[0]
		king.scale.set(0.18, 0.18, 0.18)
		const boundingBox = new THREE.Box3().setFromObject(king)
		const size = boundingBox.getSize()
		king.userData = {
			posX : 3,
			posZ : posZ,
			posY : 1 + size.y/2 - 0.49,
			color : pieceColor,
			colorCode : pieceCodeColor,
			piece : 'king',
			type : 'piece'
		}
		if(pieceColor == 'black')
		{

			// whiteKing = king
			blackKingCheck = {
				element : king,
				isChecked : false,
				color : 'black'
			}
		}
			// blackKing = king
		if(pieceColor == 'white')
		{

			// whiteKing = king
			whiteKingCheck = {
				element : king,
				isChecked : false,
				color : 'white'
			}
		}
		king.material = pieceMaterial
		king.position.x = 3
		king.position.y = 1 + size.y/2 - 0.49
		king.position.z = posZ
		king.type = 'piece'
		king.castShadow = true
		king.receiveShadow = true
		pieceStock.push(king)
		scene.add(king)
		chessGroup.add(king)
	})
	

	// QUEEN

	objectLoader.load( 'ressources/new_chess_pieces/queen.glb', function ( gltf ) {
		const queen = gltf.scene.children[0]
		queen.scale.set(0.18, 0.18, 0.18)
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
		queen.castShadow = true
		queen.receiveShadow = true
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
chessGroup.position.y = 11.5
scene.add(chessGroup)

//  INTERACTIONS




//  Create a Var about the player turn to know wich player has to play 
let playerTurn = 'white'

//  Make a var to know which piece the player clicked on to play
let pieceSelected = 0




// Listen the click player to knwo what he want to do 
window.addEventListener('click', (event) =>
{
	//  get our mouse position to know on which element we clicked
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
	raycaster.setFromCamera( mouse, camera )
	//  get all the objects that the ray has it
	const intersects = raycaster.intersectObjects( chessGroup.children )


	//  Stock the first object that the ray hit and stock it in piece selected if the object is a piece
	if(intersects[0].object.type =='piece')
	{
		if(selectionMesh != 0)
		{
			scene.remove(selectionMesh)
		}
		pieceSelection(intersects[0].object)
	} 
	else if(pieceSelected != 0)
	{
		scene.remove(selectionMesh)

	}

	//  If the player has hit a case, it normaly meansd that's he has selected a piece
	if(intersects[0].object.type == 'case' && pieceSelected != 0)
	{
		//  Call a move function depending of which piece the player has selected
		pieceMouvement(intersects[0].object, pieceSelected)

		// Reset the selection 
		// if (pieceSelected != 0)
		// {
		// 	pieceSelected = 0
		// }
	}
	//  Call the king checkmate function on every round to see if the turn put the king in check or not and make the camera move
	kingCheckMate(whiteKingCheck)
	kingCheckMate(blackKingCheck)
})









let selectionMesh = 0


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

		console.log(pieceSelected.userData.type)
		selectionMesh = new THREE.Mesh(pieceSelected.geometry, new THREE.MeshPhysicalMaterial({color : 0x3278f8}))
		selectionMesh.scale.set(pieceSelected.scale.x * 1.1, pieceSelected.scale.y* 1.1, pieceSelected.scale.z* 1.1)
		selectionMesh.position.set(pieceSelected.position.x - 3.5, pieceSelected.position.y + 11.5, pieceSelected.position.z - 3.5)
		selectionMesh.rotation.y = pieceSelected.rotation.y
		selectionMesh.material.side = THREE.BackSide

		scene.add(selectionMesh)
		// console.log('move')
		// gsap.to(selectionCyldinder.material, {transmission : 0.2, duration : 0.3, delay : 0})
		// gsap.to(selectionCyldinder.position, {x :pieceSelected.userData.posX - 3.5 ,y : 15 ,z :pieceSelected.userData.posZ - 3.5 , duration : 0.3})

	}
}

//  Function to make the turns alternates between the two players


const turnAlternate = () =>
{

	//  Call the king checkmate function on every round to see if the turn put the king in check or not and make the camera move
	// kingCheckMate(whiteKingCheck)
	// kingCheckMate(blackKingCheck)

	//  Make the truns alternate and animate the camera
	if(playerTurn == 'white')
	{
		playerTurn = 'black'
		// const tl = gsap.timeline()
		// tl.to(camera.position, {z : 0, x : 4, duration : 0.5})
		// .to(camera.position, {z : -8, x : 0,  duration : 0.5, delay : 0.7})


	}
	else if(playerTurn == 'black')
	{
		playerTurn = 'white'
		// const tl = gsap.timeline()
		// tl.to(camera.position, {z : 0, x : 4, duration : 0.5})
		// .to(camera.position, {z : 8, x: 0 ,duration : 0.5, delay : 0.7})

	}
}
//  FUNCTION to know if the case clicked is free for the piece or not
const caseFree = (caseClicked, pieceTested) =>
{
	for(let i  = 0; i< pieceStock.length; i ++)
	{
		if(pieceStock[i].userData.posX == caseClicked.userData.posX && pieceStock[i].userData.posZ == caseClicked.userData.posZ && pieceTested.userData.color == pieceStock[i].userData.color)
		{
			
			return false
		}
		if(pieceStock[i].userData.posX == caseClicked.userData.posX && pieceStock[i].userData.posZ == caseClicked.userData.posZ && pieceTested.userData.piece == 'pawn')
			{
				return false
			}
	}
	return true
}




//  All the move function works the same way, Check if the case that's has been clicked is able to reach for the piece, if yes we call the checkmove function to be sure if there is no piece on the way and check isn't occuped by a piece of the same color

const pawnMove = (caseClicked, pieceTested) =>
{
	let pawnDirection
	let pawnStart 

	if(pieceTested.userData.color == 'black')
	{
		
		pawnDirection = 1
		pawnStart = 1
	}

	if(pieceTested.userData.color == 'white')
	{
		pawnDirection = -1
		pawnStart = 6

	}
	if(caseClicked.userData.posZ - pieceTested.position.z == pawnDirection && caseClicked.userData.posX == pieceTested.position.x)
	{
		if(caseFree(caseClicked, pieceTested))
			{

				// pieceMouvement(caseClicked)
				// turnAlternate()
				return true
			}
	}
	else if(caseClicked.userData.posZ  - pieceTested.position.z == pawnDirection * 2 && pieceTested.position.z  == pawnStart && caseClicked.userData.posX == pieceTested.position.x)
	{
		if(caseFree(caseClicked, pieceTested))
			{

				// pieceMouvement(caseClicked)
				// turnAlternate()
				return true
			}

	}
	if(pawnEatMove(caseClicked, pieceTested) && caseClicked.userData.posZ - pieceTested.userData.posZ == pawnDirection && pieceTested.userData.posX - caseClicked.userData.posX == 1 ||
		pawnEatMove(caseClicked, pieceTested) && caseClicked.userData.posZ - pieceTested.userData.posZ == pawnDirection && pieceTested.userData.posX - caseClicked.userData.posX == -1)
		{
			return true
		}
}

//  CheckMove functions are used to check if there 's no piece on the piece way
const rookCheckMove  = (caseClicked, pieceTested) =>
{
	// VERTICAL
	if(caseClicked.userData.posX == pieceTested.userData.posX)
	{
		if(pieceTested.userData.posZ  - caseClicked.userData.posZ < 0)
		{
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let  u = pieceTested.userData.posZ + 1; u < caseClicked.userData.posZ ; u++)
				{
					if(u == pieceStock[i].userData.posZ && pieceTested.userData.posX == pieceStock[i].userData.posX)
					{
						return false
					}
				}
			}
		}
		if(pieceTested.userData.posZ  - caseClicked.userData.posZ > 0)
		{
			
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let u = pieceTested.userData.posZ - 1; u > caseClicked.userData.posZ ; u--)
				{
					if(u == pieceStock[i].userData.posZ && pieceTested.userData.posX == pieceStock[i].userData.posX)
					{
						return false
					}
				}
			}
		}
	}

	// HORIZONTAL
	if(caseClicked.userData.posZ == pieceTested.userData.posZ)
	{
		if(pieceTested.userData.posX  - caseClicked.userData.posX < 0)
		{
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let  u = pieceTested.userData.posX + 1; u < caseClicked.userData.posX ; u++)
				{
					if(u == pieceStock[i].userData.posX && pieceTested.userData.posZ == pieceStock[i].userData.posZ)
					{
						return false
					}
				}
			}
		}
		if(pieceTested.userData.posX  - caseClicked.userData.posX > 0)
		{
			
			for(let i = 0; i< pieceStock.length ; i++)
			{
				for(let u = pieceTested.userData.posX - 1; u > caseClicked.userData.posX ; u--)
				{
					if(u == pieceStock[i].userData.posX && pieceTested.userData.posZ == pieceStock[i].userData.posZ)
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
const rookMove = (caseClicked, pieceTested) =>
{
	if(pieceTested.position.x == caseClicked.userData.posX)
	{
		if(rookCheckMove(caseClicked, pieceTested))
		{
			if(caseFree(caseClicked, pieceTested))
			{
				return true
			}
		}
	}
	else if(pieceTested.position.z == caseClicked.userData.posZ)
	{
		if(rookCheckMove(caseClicked, pieceTested))
		{
			if(caseFree(caseClicked, pieceTested))
			{
				return true
			}
		}

	}
	
}


const knightMove = (caseClicked, pieceTested) =>
{
	if(caseClicked.userData.posX - pieceTested.userData.posX == 2 || caseClicked.userData.posX - pieceTested.userData.posX == -2)
	{
		if(caseClicked.userData.posZ - pieceTested.userData.posZ == 1 || caseClicked.userData.posZ - pieceTested.userData.posZ == -1)
		{
			if(caseFree(caseClicked, pieceTested))
			{
				return true
			}
		}
	}
	if(caseClicked.userData.posZ - pieceTested.userData.posZ == 2 || caseClicked.userData.posZ - pieceTested.userData.posZ == -2)
	{
		if(caseClicked.userData.posX - pieceTested.userData.posX == 1 || caseClicked.userData.posX - pieceTested.userData.posX == -1)
		{
			if(caseFree(caseClicked, pieceTested))
			{
				return true
			}
		}
	}
}

const bishopCheckMove = (caseClicked, pieceTested) =>
{
	if( caseClicked.userData.posX - pieceTested.userData.posX >0 && caseClicked.userData.posZ - pieceTested.userData.posZ > 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceTested.userData.posX + 1; u <caseClicked.userData.posX ;u ++ )
		{
			lineX.push(u)
		}
		for(let u = pieceTested.userData.posZ + 1; u <caseClicked.userData.posZ ;u ++ )
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

	if( caseClicked.userData.posX - pieceTested.userData.posX < 0 && caseClicked.userData.posZ - pieceTested.userData.posZ < 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceTested.userData.posX - 1; u >caseClicked.userData.posX ;u -- )
		{
			lineX.push(u)
		}
		for(let u = pieceTested.userData.posZ - 1; u >caseClicked.userData.posZ ;u --)
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
	if( caseClicked.userData.posX - pieceTested.userData.posX < 0 && caseClicked.userData.posZ - pieceTested.userData.posZ > 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceTested.userData.posX - 1; u >caseClicked.userData.posX ;u -- )
		{
			lineX.push(u)
		}
		for(let u = pieceTested.userData.posZ  + 1; u < caseClicked.userData.posZ ;u ++)
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
	if( caseClicked.userData.posX - pieceTested.userData.posX > 0 && caseClicked.userData.posZ - pieceTested.userData.posZ < 0)
	{
		let lineX = []
		let lineZ = []
		for(let u = pieceTested.userData.posX + 1; u < caseClicked.userData.posX ;u ++ )
		{
			lineX.push(u)
		}
		for(let u = pieceTested.userData.posZ  - 1; u > caseClicked.userData.posZ ;u --)
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


const bishopMove = (caseClicked, pieceTested) =>
{
	if(caseClicked.userData.posX - pieceTested.userData.posX == caseClicked.userData.posZ - pieceTested.userData.posZ ||
	-(caseClicked.userData.posX - pieceTested.userData.posX) == caseClicked.userData.posZ - pieceTested.userData.posZ ||
	-(caseClicked.userData.posX - pieceTested.userData.posX) == -(caseClicked.userData.posZ - pieceTested.userData.posZ) ||
	caseClicked.userData.posX - pieceTested.userData.posX == -(caseClicked.userData.posZ - pieceTested.userData.posZ) )
	{
		if(bishopCheckMove(caseClicked, pieceTested))
		{
			if(caseFree(caseClicked, pieceTested))
			{
				return true
			}
		}
	}
}

const queenMove = (caseClicked, pieceTested) =>
{
	if(bishopMove(caseClicked, pieceTested) || rookMove(caseClicked, pieceTested))
	{
		return true
	}
}

const kingMove = (caseClicked, pieceTested) =>
{
	if(pieceTested.userData.posX - caseClicked.userData.posX >= -1 && pieceTested.userData.posX - caseClicked.userData.posX <= 1 &&
								pieceTested.userData.posZ - caseClicked.userData.posZ >= -1 && pieceTested.userData.posZ - caseClicked.userData.posZ <= 1 && caseFree(caseClicked, pieceTested))
	{
		return true
	}
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
const pawnEatMove = (caseClicked) =>
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







const pieceMouvementAnimationDecision = (caseClicked) =>
{
	const pieceSelectedExPosX = pieceSelected.userData.posX
	const pieceSelectedExPosZ = pieceSelected.userData.posZ
	pieceSelected.userData.posZ = caseClicked.userData.posZ 
	pieceSelected.userData.posX = caseClicked.userData.posX 
	if(playerTurn === 'black')
	{
		eatPiece(caseClicked)
		if(kingCheckMate(blackKingCheck))
		{
			pieceSelected.userData.posZ = pieceSelectedExPosZ 
			pieceSelected.userData.posX = pieceSelectedExPosX 
			console.log('wrong move')
		}
		else
		{
			gsap.to(pieceSelected.position, { x : pieceSelected.userData.posX, z : pieceSelected.userData.posZ, duration : 0.8})
			turnAlternate()
		}
	}
	else if(playerTurn ===  'white')
	{
		eatPiece(caseClicked)
		if(kingCheckMate(whiteKingCheck))
		{
			pieceSelected.userData.posZ = pieceSelectedExPosZ 
			pieceSelected.userData.posX = pieceSelectedExPosX 
			console.log('wrong move')
		}
		else
		{
			gsap.to(pieceSelected.position, { x : pieceSelected.userData.posX, z : pieceSelected.userData.posZ, duration : 0.8})
			turnAlternate()
		}
	}
}



// Short function to make the pieces animate when they move by using gsap and udpate pieces datas
const pieceMouvement = (caseClicked, pieceTested) =>
{ 
	if(pieceTested.userData.piece == 'pawn' && pawnMove(caseClicked, pieceTested))
		{
			pieceMouvementAnimationDecision(caseClicked)
		}

		if(pieceTested.userData.piece == 'rook' && rookMove(caseClicked, pieceTested))
		{
			pieceMouvementAnimationDecision(caseClicked)
		}

		if(pieceTested.userData.piece == 'knight' && knightMove(caseClicked, pieceTested))
		{
			pieceMouvementAnimationDecision(caseClicked)
		}

		if(pieceTested.userData.piece == 'bishop' && bishopMove(caseClicked, pieceTested))
		{
			pieceMouvementAnimationDecision(caseClicked)
		}

		if(pieceTested.userData.piece == 'queen' && queenMove(caseClicked, pieceTested))
		{
			pieceMouvementAnimationDecision(caseClicked)

		}

		if(pieceTested.userData.piece == 'king' && kingMove(caseClicked, pieceTested))
		{
			pieceMouvementAnimationDecision(caseClicked)
		}
		pieceSelected = 0
}

//  Function to check if the king is in check (Not already fully functional)


// Shape that show which taht the king is checked----> SHoudl be like an aura when i'll learn shaders correctly
// const checkCyldinder = new THREE.Mesh(
// 	new THREE.CylinderBufferGeometry(0.4, 0.4, 0.5),
// 	new THREE.MeshPhysicalMaterial({
// 		color: 0xff0000,
// 		transmission: 1, // use material.transmission for glass materials
// 		opacity: 1, // set material.opacity to 1 when material.transmission is non-zero
// 		transparent: true})
// )

// checkCyldinder.position.set(0,15,0)
// scene.add(checkCyldinder)





const kingCheckMate = (king) =>
{
	for(let i = 0; i < pieceStock.length; i++)
	{
			if(pieceStock[i].userData.piece == 'queen' && pieceStock[i].userData.color != king.color)
			{
				if(queenMove(king.element, pieceStock[i]))
				{
					king.isChecked = true
					
				}
			}
			if(pieceStock[i].userData.piece == 'bishop' && pieceStock[i].userData.color != king.color)
			{
				if(bishopMove(king.element, pieceStock[i]))
				{
					king.isChecked = true
				}
			}

			if(pieceStock[i].userData.piece == 'rook' && pieceStock[i].userData.color != king.color)
			{
				if(rookMove(king.element, pieceStock[i]))
				{
					king.isChecked = true
				}
			}

			if(pieceStock[i].userData.piece == 'knight' && pieceStock[i].userData.color != king.color)
			{
				if(knightMove(king.element, pieceStock[i]))
				{
					king.isChecked = true
				}
			}
	}
	// if(king.isChecked)
	// {
	// 	gsap.to(checkCyldinder.material, {transmission : 0.2, duration : 0.3, delay : 0})
	// 	gsap.to(checkCyldinder.position, {x :king.element.userData.posX - 3.5 ,y : 15 ,z :king.element.userData.posZ - 3.5 , duration : 0.3})
	// }
	// console.log( `${king.color} check is `, king.isChecked )

	// if(whiteKingCheck.isChecked == false && blackKingCheck.isChecked == false)
	// {
	// 	gsap.to(checkCyldinder.position, {x :0 ,y : 15 ,z :0 , duration : 0.3, delay : 0})
	// }
	if(king.isChecked)
	{
		king.isChecked = false
		return true
	}
}

