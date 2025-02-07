import * as BABYLON from "babylonjs";
import { Tank } from "./tank";
import { GameObject } from "./gameObject";

export class Game {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private tank: Tank;
  private objects: GameObject[] = [];
  private score: number = 0;
  private inputStates: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  } = { up: false, down: false, left: false, right: false };

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.tank = new Tank(this.scene);
    const camera = new BABYLON.FollowCamera(
      "followCamera",
      new BABYLON.Vector3(0, 10, -30),
      this.scene
    );
    camera.lockedTarget = this.tank.getMesh(); // La caméra suit le tank
    camera.radius = 30;
    camera.heightOffset = 10;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.1;
    camera.maxCameraSpeed = 5;

    this.scene.activeCamera = camera;

    this.scene.collisionsEnabled = true;

    this.createScene();
    this.setupInputListeners();
    this.createCamera();
    this.spawnObjects();
    this.run();
  }

  private createScene(): void {
    const light = new BABYLON.DirectionalLight(
      "dir0",
      new BABYLON.Vector3(-1, -1, 0),
      this.scene
    );
    light.intensity = 1.2;

    this.createGround();
    this.createSkybox();
    this.createCamera();
  }

  private createCamera(): void {
    const target = this.tank.getMesh();

    // Caméra qui suit le tank
    const camera = new BABYLON.FollowCamera("followCamera", new BABYLON.Vector3(0, 10, -30), this.scene);
    camera.lockedTarget = target;  // La caméra suit automatiquement le tank
    camera.radius = 50;            // Distance de la caméra
    camera.heightOffset = 15;       // Hauteur de la caméra
    camera.rotationOffset = 180;    // Vue de derrière
    camera.cameraAcceleration = 0.1;
    camera.maxCameraSpeed = 5;

    this.scene.activeCamera = camera; // Active la caméra
}


private createGround(): void {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, this.scene);

    // Création du matériau standard pour le sol
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("/images/grass.jpg", this.scene); // Texture d'herbe

    // Répéter la texture pour éviter un effet étiré
    (groundMaterial.diffuseTexture as BABYLON.Texture).uScale = 50;
    (groundMaterial.diffuseTexture as BABYLON.Texture).vScale = 50;

    // Appliquer le matériau au sol
    ground.material = groundMaterial;
}



  private createSkybox(): void {
    // Créer une grande boîte pour la Skybox
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);

    // Créer le matériau pour la Skybox
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", this.scene);
    skyboxMaterial.backFaceCulling = false; // Afficher l'intérieur de la boîte
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/images/skybox/bluecloud", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0); // Pas de couleur diffuse
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Pas de reflets

    // Appliquer le matériau à la Skybox
    skybox.material = skyboxMaterial;
}


  private spawnObjects(): void {
    for (let i = 0; i < 15; i++) {
      this.objects.push(new GameObject(this.scene, "bonus"));
      this.objects.push(new GameObject(this.scene, "obstacle"));
    }
  }

  private checkCollisions(): void {
    this.objects = this.objects.filter((obj) => {
      if (
        BABYLON.Vector3.Distance(
          this.tank.getMesh().position,
          obj.getMesh().position
        ) < 4
      ) {
        if (obj.getType() === "bonus") {
          this.score += 10;
          console.log("🎉 Bonus ! Score :", this.score);
        } else {
          this.score -= 10;
          console.log("💥 Obstacle touché ! Score :", this.score);
        }
        obj.remove();
        return false;
      }
      return true;
    });
  }

  private setupInputListeners(): void {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "z":
        case "Z":
          this.inputStates.up = true;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.inputStates.down = true;
          break;
        case "ArrowLeft":
        case "q":
        case "Q":
          this.inputStates.left = true;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.inputStates.right = true;
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "z":
        case "Z":
          this.inputStates.up = false;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.inputStates.down = false;
          break;
        case "ArrowLeft":
        case "q":
        case "Q":
          this.inputStates.left = false;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.inputStates.right = false;
          break;
      }
    });
  }

  private run(): void {
    this.engine.runRenderLoop(() => {
      this.tank.move(this.inputStates); // Déplace le tank à chaque frame
      this.checkCollisions();
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
}
