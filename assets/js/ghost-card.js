// Adapted Ghost Card for bag1 site
import { EffectComposer } from "https://unpkg.com/three@0.120.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://unpkg.com/three@0.120.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://unpkg.com/three@0.120.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OBJLoader } from "https://unpkg.com/three@0.120.0/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "https://unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls";

// Asset URLs
var cardtemplate = "https://raw.githubusercontent.com/pizza3/asset/master/cardtemplate3.png";
var cardtemplateback = "https://raw.githubusercontent.com/pizza3/asset/master/cardtemplateback4.png";
var flower = "https://raw.githubusercontent.com/pizza3/asset/master/flower3.png";
var noise2 = "https://raw.githubusercontent.com/pizza3/asset/master/noise2.png";
var color11 = "https://raw.githubusercontent.com/pizza3/asset/master/color11.png";
var backtexture = "https://raw.githubusercontent.com/pizza3/asset/master/color3.jpg";
var skullmodel = "https://raw.githubusercontent.com/pizza3/asset/master/skull5.obj";
var voronoi = "https://raw.githubusercontent.com/pizza3/asset/master/rgbnoise2.png";

var scene, sceneRTT, camera, cameraRTT, renderer, container;
var frontmaterial, backmaterial, controls, bloomPass, composer, frontcard, backcard;
var width = 650, height = 400;

// Site-themed colors (green accent)
var options = {
  exposure: 2.8,
  bloomStrength: 1.2,
  bloomThreshold: 0,
  bloomRadius: 1.29,
  color0: [0, 255, 102], // Green accent
  color1: [5, 8, 7],     // Dark background
  color2: [0, 255, 102], // Green eyes
  isanimate: true,
};

// Shaders (same as original)
const vert = `
  varying vec2 vUv;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    camPos = cameraPosition;
    vNormal = normal;
    vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
    eyeVector = normalize(worldPosition.xyz - abs(cameraPosition));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragPlane = `
	varying vec2 vUv;
  uniform sampler2D skullrender;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform vec4 resolution;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow( 1.0 + dot( eyeVector, worldNormal), 1.80 );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy ;
    vec4 temptex = texture2D( cardtemplate, vUv);
    vec4 skulltex = texture2D( skullrender, uv - 0.5 );
    gl_FragColor = temptex;
    float f = Fresnel(eyeVector, vNormal);
    vec4 noisetex = texture2D( noise, mod(vUv*2.,1.));
    if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6){
      gl_FragColor = f + skulltex;
      gl_FragColor += noisetex/5.;

    } else {
      vec4 bactex = texture2D( backtexture, vUv);
      float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
      vec4 colortex = texture2D( color, vec2(tone,0.));

      //sparkle code, dont touch this!
      vec2 uv2 = vUv;
      vec3 pixeltex = texture2D(noiseTex,mod(uv*5.,1.)).rgb;      
      float iTime = 1.*0.004;
      uv.y += iTime / 10.0;
      uv.x -= (sin(iTime/10.0)/2.0);
      uv2.y += iTime / 14.0;
      uv2.x += (sin(iTime/10.0)/9.0);
      float result = 0.0;
      result += texture2D(noiseTex, mod(uv*4.,1.) * 0.6 + vec2(iTime*-0.003)).r;
      result *= texture2D(noiseTex, mod(uv2*4.,1.) * 0.9 + vec2(iTime*+0.002)).b;
      result = pow(result, 10.0);
      gl_FragColor *= colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y/10.)*10.))/8.;

    }

    gl_FragColor.a = temptex.a;
  }
`;

const fragPlaneback = `
	varying vec2 vUv;
  uniform sampler2D skullrender;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform vec4 resolution;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow( 1.0 + dot( eyeVector, worldNormal), 1.80 );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy ;
    vec4 temptex = texture2D( cardtemplate, vUv);
    vec4 skulltex = texture2D( skullrender, vUv );
    gl_FragColor = temptex;
    vec4 noisetex = texture2D( noise, mod(vUv*2.,1.));
    float f = Fresnel(eyeVector, vNormal);

    vec2 uv2 = vUv;
    vec3 pixeltex = texture2D(noiseTex,mod(uv*5.,1.)).rgb;      
    float iTime = 1.*0.004;
    uv.y += iTime / 10.0;
    uv.x -= (sin(iTime/10.0)/2.0);
    uv2.y += iTime / 14.0;
    uv2.x += (sin(iTime/10.0)/9.0);
    float result = 0.0;
    result += texture2D(noiseTex, mod(uv*4.,1.) * 0.6 + vec2(iTime*-0.003)).r;
    result *= texture2D(noiseTex, mod(uv2*4.,1.) * 0.9 + vec2(iTime*+0.002)).b;
    result = pow(result, 10.0);

    vec4 bactex = texture2D( backtexture, vUv);
    float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
    vec4 colortex = texture2D( color, vec2(tone,0.));
    if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6){
      float tone = pow(dot(normalize(camPos), normalize(skulltex.rgb)), 1.);
      vec4 colortex2 = texture2D( color, vec2(tone,0.));
      if(skulltex.a > 0.2){
        gl_FragColor = colortex;
      } else {
        gl_FragColor = vec4(0.) + f;
        gl_FragColor += noisetex/5.;
      }
      gl_FragColor += noisetex/5.;
    
    } else {
      gl_FragColor *= colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y/10.)*10.))/8.;
    }
  }
`;

const vertskull = `
      varying vec3 vNormal;
      varying vec3 camPos;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 eyeVector;

      void main() {
        vNormal = normal;
        vUv = uv;
        camPos = cameraPosition;
        vPosition = position;
        vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
        eyeVector = normalize(worldPosition.xyz - cameraPosition);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
`;

const fragskull = `
      #define NUM_OCTAVES 5
      uniform vec4 resolution;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;
      varying vec3 camPos;
      varying vec2 vUv;
      uniform vec3 color1;
      uniform vec3 color0;
      varying vec3 eyeVector;

      float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);

        float res = mix(
          mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
          mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
      }

      float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < NUM_OCTAVES; ++i) {
          v += a * noise(x);
          x = rot * x * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      float setOpacity(float r, float g, float b) {
        float tone = (r + g + b) / 3.0;
        float alpha = 1.0;
        if(tone<0.69) {
          alpha = 0.0;
        }
        return alpha;
      }

      vec3 rgbcol(float r, float g, float b) {
        return vec3(r/255.0,g/255.0,b/255.0);
      }

      float Fresnel(vec3 eyeVector, vec3 worldNormal) {
        return pow( 1.0 + dot( eyeVector, worldNormal), 3.0 );
      }
     
      void main() {
        vec2 olduv = gl_FragCoord.xy/resolution.xy ;
        float f = Fresnel(eyeVector, vNormal);
        float gradient2 = (f)*(.3 - vPosition.y) ;
        float scale = 8.;
        olduv.y = olduv.y - time;
        vec2 p = olduv*scale;
        float noise = fbm( p + time );
        
        vec2 uv = gl_FragCoord.xy/resolution.xy ; 

        vec3 newCam = vec3(0.,5.,10.);
        float gradient = dot(.0 -  normalize( newCam ), normalize( vNormal )) ;

        vec3 viewDirectionW = normalize(camPos - vPosition);
        float fresnelTerm = dot(viewDirectionW, vNormal);  
        fresnelTerm = clamp( 1. - fresnelTerm, 0., 1.) ;

        vec3 color = vec3(noise) + gradient;
        vec3 color2 = color - 0.2;

        float noisetone = setOpacity(color.r,color.g,color.b);
        float noisetone2 = setOpacity(color2.r,color2.g,color2.b);

        vec4 backColor = vec4(color, 1.);
        backColor.rgb = rgbcol(color0.r,color0.g,color0.b)*noisetone;

        vec4 frontColor = vec4(color2, 1.);
        frontColor.rgb = rgbcol(color1.r,color1.g,color1.b)*noisetone;

        if(noisetone2>0.0){
          gl_FragColor = frontColor;
        } else {
          gl_FragColor = backColor;
        }
      }
`;

window.initGhostCard = function() {
  console.log("Initializing ghost card...");
  container = document.getElementById("ghost-card-container");
  if (!container) {
    console.log("Ghost card container not found!");
    return;
  }
  console.log("Ghost card container found, starting initialization...");
  
  // Clear loading text
  container.innerHTML = '';

  camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
  camera.position.z = 100;
  
  cameraRTT = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
  cameraRTT.position.z = 30;
  cameraRTT.position.y = -3.5;

  scene = new THREE.Scene();
  sceneRTT = new THREE.Scene();
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.autoClear = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.update();
  
  container.appendChild(renderer.domElement);

  var renderScene = new RenderPass(sceneRTT, cameraRTT);
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.7,
    0.4,
    0.85
  );
  
  composer = new EffectComposer(renderer);
  composer.renderToScreen = false;
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  plane();
  planeback();
  loadskull();
  animate();
};

function plane() {
  var geometry = new THREE.PlaneGeometry(20, 30);
  frontmaterial = new THREE.ShaderMaterial({
    uniforms: {
      cardtemplate: {
        type: "t",
        value: new THREE.TextureLoader().load(cardtemplate),
      },
      backtexture: {
        type: "t",
        value: new THREE.TextureLoader().load(backtexture),
      },
      noise: {
        type: "t",
        value: new THREE.TextureLoader().load(noise2),
      },
      skullrender: {
        type: "t",
        value: composer.readBuffer.texture,
      },
      resolution: {
        value: new THREE.Vector2(width, height),
      },
      noiseTex: {
        type: "t",
        value: new THREE.TextureLoader().load(voronoi),
      },
      color: {
        type: "t",
        value: new THREE.TextureLoader().load(color11),
      },
    },
    fragmentShader: fragPlane,
    vertexShader: vert,
    transparent: true,
    depthWrite: false,
  });

  frontcard = new THREE.Mesh(geometry, frontmaterial);
  scene.add(frontcard);
}

function planeback() {
  var geometry = new THREE.PlaneGeometry(20, 30);
  backmaterial = new THREE.ShaderMaterial({
    uniforms: {
      cardtemplate: {
        type: "t",
        value: new THREE.TextureLoader().load(cardtemplateback),
      },
      backtexture: {
        type: "t",
        value: new THREE.TextureLoader().load(backtexture),
      },
      noise: {
        type: "t",
        value: new THREE.TextureLoader().load(noise2),
      },
      skullrender: {
        type: "t",
        value: new THREE.TextureLoader().load(flower),
      },
      resolution: {
        value: new THREE.Vector2(width, height),
      },
      noiseTex: {
        type: "t",
        value: new THREE.TextureLoader().load(voronoi),
      },
      color: {
        type: "t",
        value: new THREE.TextureLoader().load(color11),
      },
    },
    fragmentShader: fragPlaneback,
    vertexShader: vert,
    transparent: true,
    depthWrite: false,
  });
  
  backcard = new THREE.Mesh(geometry, backmaterial);
  backcard.rotation.set(0, Math.PI, 0);
  scene.add(backcard);
}

var eye, eye2, basicmat, skullmaterial, modelgroup = new THREE.Group();

function loadskull() {
  skullmaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        type: "f",
        value: 0.0,
      },
      color1: {
        value: new THREE.Vector3(...options.color1),
      },
      color0: {
        value: new THREE.Vector3(...options.color0),
      },
      resolution: {
        value: new THREE.Vector2(width, height),
      },
    },
    fragmentShader: fragskull,
    vertexShader: vertskull,
  });

  var spheregeo = new THREE.SphereGeometry(1.5, 32, 32);
  basicmat = new THREE.MeshBasicMaterial();
  basicmat.color.setRGB(...options.color2);
  eye = new THREE.Mesh(spheregeo, basicmat);
  eye2 = new THREE.Mesh(spheregeo, basicmat);
  eye.position.set(-2.2, -2.2, -6.6);
  eye2.position.set(2.2, -2.2, -6.6);
  modelgroup = new THREE.Object3D();
  modelgroup.add(eye);
  modelgroup.add(eye2);
  
  var objloader = new OBJLoader();
  objloader.load(skullmodel, function (object) {
    var mesh2 = object.clone();
    mesh2.position.set(0, 0, -10);
    mesh2.rotation.set(Math.PI, 0, Math.PI);

    mesh2.children.forEach((val, key) => {
      val.traverse(function (child) {
        child.geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
        child.geometry.mergeVertices();
        child.material = skullmaterial;
        child.verticesNeedUpdate = true;
        child.normalsNeedUpdate = true;
        child.uvsNeedUpdate = true;
        child.material.flatShading = THREE.SmoothShading;
        child.geometry.computeVertexNormals();
      });
      mesh2.scale.set(8, 8, 8);
      modelgroup.add(mesh2);
      sceneRTT.add(modelgroup);
    });
  });
}

var matrix = new THREE.Matrix4();
var period = 5;
var clock = new THREE.Clock();

function updateDraw(deltaTime) {
  if (modelgroup) {
    modelgroup.rotation.set(-camera.rotation._x, -camera.rotation._y, 0);
  }
  
  if (options.isanimate) {
    matrix.makeRotationY((clock.getDelta() * 0.7 * Math.PI) / period);
    camera.position.applyMatrix4(matrix);
    camera.lookAt(frontcard.position);
  }

  if (bloomPass) {
    bloomPass.threshold = options.bloomThreshold;
    bloomPass.strength = options.bloomStrength;
    bloomPass.radius = options.bloomRadius;
  }

  if (skullmaterial) {
    skullmaterial.uniforms.time.value = deltaTime / 4000;
    skullmaterial.uniforms.color1.value = new THREE.Vector3(...options.color1);
    skullmaterial.uniforms.color0.value = new THREE.Vector3(...options.color0);
    if (eye2 && eye) {
      eye2.material.color.setRGB(...options.color2);
      eye.material.color.setRGB(...options.color2);
    }
  }
}

function animate(deltaTime) {
  requestAnimationFrame(animate);
  updateDraw(deltaTime);
  if (composer) composer.render();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

function handleResize() {
  if (!camera || !renderer) return;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  if (frontcard && frontcard.material) {
    frontcard.material.uniforms.resolution.value = new THREE.Vector2(width, height);
  }
  
  if (skullmaterial) {
    skullmaterial.uniforms.resolution.value = new THREE.Vector2(width, height);
  }
  
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for the reveal animation
  setTimeout(window.initGhostCard, 1000);
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initGhostCard);
} else {
  setTimeout(window.initGhostCard, 1000);
}

window.addEventListener("resize", handleResize, false);
