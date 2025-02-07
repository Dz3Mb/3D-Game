import * as BABYLON from "babylonjs";

export class GameObject {
    private static existingPositions: BABYLON.Vector3[] = []; // Stocke les positions déjà utilisées

    private mesh: BABYLON.Mesh;
    private type: "bonus" | "obstacle";
    private speed: BABYLON.Vector3; // Vitesse de déplacement

    constructor(scene: BABYLON.Scene, type: "bonus" | "obstacle") {
        this.type = type;

        if (type === "bonus") {
            this.mesh = BABYLON.MeshBuilder.CreateSphere("bonus", { diameter: 3 }, scene);
            this.mesh.material = new BABYLON.StandardMaterial("bonusMat", scene);
            (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(0, 1, 0); // Vert (bonus)
        } else {
            this.mesh = BABYLON.MeshBuilder.CreateBox("obstacle", { size: 3 }, scene);
            this.mesh.material = new BABYLON.StandardMaterial("obstacleMat", scene);
            (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(1, 0, 0); // Rouge (obstacle)
        }

        this.mesh.position = this.getRandomPosition();
        this.mesh.checkCollisions = true;
        this.mesh.isPickable = false; 

        // Donne un mouvement léger aux objets
        this.speed = new BABYLON.Vector3(
            (Math.random() - 0.5) * 0.2, 
            0, 
            (Math.random() - 0.5) * 0.2
        );

        // Anime le mouvement des objets
        scene.onBeforeRenderObservable.add(() => {
            this.mesh.position.addInPlace(this.speed);
            if (Math.random() < 0.01) {
                this.speed = new BABYLON.Vector3((Math.random() - 0.5) * 0.2, 0, (Math.random() - 0.5) * 0.2);
            }
        });
    }

    private getRandomPosition(): BABYLON.Vector3 {
        let pos: BABYLON.Vector3;
        let isTooClose: boolean;
        let attempts = 0; // Compteur de tentatives
        const maxAttempts = 100; // Limite pour éviter une boucle infinie
    
        do {
            pos = new BABYLON.Vector3(
                Math.random() * 150 - 75, // Zone plus large pour éviter la saturation
                2,
                Math.random() * 150 - 75
            );
    
            // Vérifie si la position est trop proche d'un autre objet
            isTooClose = GameObject.existingPositions.some(existingPos => 
                BABYLON.Vector3.Distance(existingPos, pos) < 15 // Augmente la distance minimale
            );
    
            attempts++;
            if (attempts >= maxAttempts) {
                console.warn("⚠ Impossible de placer un objet après plusieurs essais.");
                break; // Évite un blocage complet
            }
    
        } while (isTooClose);
    
        // Sauvegarde la position pour éviter d'autres spawns trop proches
        GameObject.existingPositions.push(pos);
    
        return pos;
    }
       

    public getMesh(): BABYLON.Mesh {
        return this.mesh;
    }

    public getType(): "bonus" | "obstacle" {
        return this.type;
    }

    public remove(): void {
        this.mesh.dispose();
    }
}