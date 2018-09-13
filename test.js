
const path = require("path")
const fs = require("fs-extra")
document.addEventListener("DOMContentLoaded", run, false)

function run() {
    if (BABYLON.Engine.isSupported()) {

        var width = 0
        var height = 0
        //var canvas = document.getElementById("renderCanvas1")
        var canvas = document.createElement('canvas')
        document.body.appendChild(canvas)
        canvas.hidden = true
        var engine = new BABYLON.Engine(canvas, false)
        // This creates a Babylon Scene object (not a shape/mesh)
        var scene = new BABYLON.Scene(engine)
        scene.clearColor = BABYLON.Color3.FromInts(44, 44, 44)
        var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -100), scene)
        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
        camera.attachControl(canvas, true)
        
        // This creates a light - aimed 0,1,0 - to the sky.
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)

        var assetsManager = new BABYLON.AssetsManager(scene)
        var texturetask = assetsManager.addTextureTask("Texture", "mole3.jpg")
        var material = new BABYLON.StandardMaterial("material", scene)
        texturetask.onSuccess = function (task) {

            var mesh = BABYLON.MeshBuilder.CreatePlane("myPlane", { width: task.texture.getSize().width, height: task.texture.getSize().height }, scene)
            mesh.material = material
            mesh.material.diffuseTexture = task.texture
            width = task.texture.getSize().width
            height = task.texture.getSize().height
        }

        var t = timer("scene ready")
        //Render
        scene.executeWhenReady(function () {
            canvas.width = width
            canvas.height = height
            t.stop()
            scene.render()
            console.log(width, height)
            var t3 = timer("get image data")
            var gl = canvas.getContext("webgl2")
            var pixels = new Uint8Array(width * height * 4)
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
            var image = new ImageData(new Uint8ClampedArray(pixels), width, height)
            var canvas1 = document.createElement('canvas')
            document.body.appendChild(canvas1)
            canvas1.width = width
            canvas1.height = height
            var ctx = canvas1.getContext("2d")
            ctx.putImageData(image, 0, 0)
            t3.stop()
        })
        // engine.runRenderLoop(function () {
        //     t.stop()
        //     scene.render()
        //     // console.log(width, height)
        //     // var t3 = timer("get image data")
        //     // var gl = canvas.getContext("webgl2")
        //     // var pixels = new Uint8Array(width * height * 4)
        //     // gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        //     // var image = new ImageData(new Uint8ClampedArray(pixels), width, height)
        //     // var canvas1 = document.createElement('canvas')
        //     // canvas1.width = width
        //     // canvas1.height = height
        //     // var ctx = canvas.getContext("2d")
        //     // ctx.gutImageData(image, 0, 0)
        //     // t3.stop()
        //     //engine.stopRenderLoop()
        // })

        assetsManager.load()
    }
}

function timer(name) {
    var start = new Date();
    return {
        stop: function () {
            var end = new Date();
            var time = end.getTime() - start.getTime();
            console.log('Timer:', name, 'finished in', time, 'ms');
        }
    }
}