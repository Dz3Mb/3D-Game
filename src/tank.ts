import * as BABYLON from "babylonjs";

export class Tank {
    private body: BABYLON.Mesh;
    private turret: BABYLON.Mesh;
    private cannon: BABYLON.Mesh;
    private leftTrack: BABYLON.Mesh;
    private rightTrack: BABYLON.Mesh;
    private speed: number = 0;
    private acceleration: number = 0.02;
    private maxSpeed: number = 2;
    private friction: number = 0.01;
    private rotationSpeed: number = 0.02;
    private frontVector: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 1);

    constructor(scene: BABYLON.Scene) {
        // Création du matériau PBR pour le tank
        let tankMaterial = new BABYLON.PBRMaterial("tankMaterial", scene);
        tankMaterial.albedoTexture = new BABYLON.Texture("/images/tank/PaintedMetal014_1K-JPG_Color.jpg", scene);
        tankMaterial.ambientTexture = new BABYLON.Texture("/images/tank/PaintedMetal014_1K-JPG_AmbientOcclusion.jpg", scene);
        tankMaterial.metallicTexture = new BABYLON.Texture("/images/tank/PaintedMetal014_1K-JPG_Metalness.jpg", scene);
        tankMaterial.bumpTexture = new BABYLON.Texture("/images/tank/PaintedMetal014_1K-JPG_NormalGL.jpg", scene);
        tankMaterial.useRoughnessFromMetallicTextureAlpha = false;

        // Création du corps du tank
        this.body = BABYLON.MeshBuilder.CreateBox("tankBody", { height: 1.5, depth: 8, width: 5 }, scene);
        this.body.position.y = 2;
        this.body.material = tankMaterial;
        this.body.checkCollisions = true;
        this.body.ellipsoid = new BABYLON.Vector3(2, 2, 2);
        this.body.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);

        // Création de la tourelle
        this.turret = BABYLON.MeshBuilder.CreateBox("tankTurret", { height: 1, depth: 4, width: 3 }, scene);
        this.turret.position.y = 1.5;
        this.turret.parent = this.body;
        this.turret.material = tankMaterial;

        // Création du canon
        this.cannon = BABYLON.MeshBuilder.CreateCylinder("tankCannon", { diameter: 0.6, height: 6 }, scene);
        this.cannon.rotation.x = -1.8;
        this.cannon.position.y = 0.8;
        this.cannon.position.z = 3;
        this.cannon.parent = this.turret;
        this.cannon.material = tankMaterial;

        // Création du matériau des chenilles (différent du corps)
        let trackMaterial = new BABYLON.PBRMaterial("trackMaterial", scene);
        trackMaterial.albedoTexture = new BABYLON.Texture("/images/tank/tank_tracks.jpg", scene);
        trackMaterial.roughness = 1;
        trackMaterial.metallic = 0.5;

        // Création des chenilles (gauche et droite)
        this.leftTrack = BABYLON.MeshBuilder.CreateBox("leftTrack", { height: 1, depth: 7, width: 1 }, scene);
        this.rightTrack = BABYLON.MeshBuilder.CreateBox("rightTrack", { height: 1, depth: 7, width: 1 }, scene);
        
        this.leftTrack.material = trackMaterial;
        this.rightTrack.material = trackMaterial;
        
        this.leftTrack.position.set(-2, -1, 0); // Sous le tank, extrémité gauche
        this.rightTrack.position.set(2, -1, 0); // Sous le tank, extrémité droite
        
        this.leftTrack.parent = this.body;
        this.rightTrack.parent = this.body;
    }

    public move(inputStates: any) {
        let moveVector = new BABYLON.Vector3(0, 0, 0);

        if (inputStates.up) {
            if (this.speed < 0) {
                this.speed += this.acceleration * 3; // Freinage rapide avant d'avancer
            } else {
                this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
            }
        } 
        else if (inputStates.down) {
            if (this.speed > 0) {
                this.speed -= this.acceleration * 3; // Freinage rapide avant de reculer
            } else {
                this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed / 2);
            }
        } 
        else {
            this.speed *= (1 - this.friction);
        }

        if (Math.abs(this.speed) < 0.01) this.speed = 0;

        moveVector = this.frontVector.scale(this.speed);

        // Rotation améliorée
        let rotationFactor = Math.abs(this.speed) / this.maxSpeed;
        let turnSpeed = this.rotationSpeed * 2;
        if (this.speed !== 0) {
            let directionMultiplier = this.speed > 0 ? 1 : -1;
            if (inputStates.left) {
                this.body.rotation.y -= turnSpeed * rotationFactor * directionMultiplier;
            }
            if (inputStates.right) {
                this.body.rotation.y += turnSpeed * rotationFactor * directionMultiplier;
            }

            this.frontVector = new BABYLON.Vector3(
                Math.sin(this.body.rotation.y),
                0,
                Math.cos(this.body.rotation.y)
            );
        }

        this.body.moveWithCollisions(moveVector);
    }

    public getMesh(): BABYLON.Mesh {
        return this.body;
    }

    public getSpeed(): number {
        return this.speed;
    }
}