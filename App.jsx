import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Image as DreiImage, Float, Environment } from '@react-three/drei';
import { Upload, Cake } from 'lucide-react';
import './App.css';

// 3D Card Component
const PhotoCard = ({ url, index, total }) => {
  const radius = 3.8;
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.lookAt(0, 0, 0);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <DreiImage ref={ref} url={url} position={[x, y, z]} scale={[1.2, 1.6]} transparent side={2} />
    </Float>
  );
};

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [cakePos, setCakePos] = useState({ top: '50%', left: '50%' });
  const [images, setImages] = useState([
    'https://picsum.photos/400/600?random=21',
    'https://picsum.photos/400/600?random=22',
    'https://picsum.photos/400/600?random=23'
  ]);

  const moveCake = () => {
    setCakePos({ top: `${Math.random() * 70 + 15}%`, left: `${Math.random() * 70 + 15}%` });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImages([...images, URL.createObjectURL(file)]);
  };

  return (
    <div className="container">
      {!unlocked ? (
        <div className="prank-screen">
          <p className="hint">Catch it to unlock Level 21...</p>
          <button 
            className="cake-btn" 
            style={{ top: cakePos.top, left: cakePos.left }}
            onMouseEnter={moveCake}
            onClick={() => setUnlocked(true)}
          >
            <Cake size={60} color="#ffd700" />
          </button>
        </div>
      ) : (
        <div className="orb-screen">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              
              {/* The Glass Orb */}
              <Sphere args={[4.2, 64, 64]}>
                <MeshDistortMaterial 
                  color="#ffffff" 
                  speed={2} 
                  distort={0.15} 
                  transmission={1} 
                  thickness={2} 
                  roughness={0.05} 
                  transparent 
                  opacity={0.2} 
                />
              </Sphere>

              {images.map((url, i) => (
                <PhotoCard key={i} url={url} index={i} total={images.length} />
              ))}

              <Environment preset="city" />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>

          <div className="overlay">
            <h1 className="title">Professional Late Responder</h1>
            <label className="upload-btn">
              <Upload size={18} /> Add Memory
              <input type="file" hidden onChange={handleUpload} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}