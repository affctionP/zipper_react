import React, { useRef, useEffect, useState } from 'react';
import { TweenMax, TimelineMax, gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './Zipper.css'; // Assuming you have a CSS file for styling

gsap.registerPlugin(Draggable);

const Zipper = () => {
  const containerRef = useRef(null);
  const zipTagRef = useRef(null);
  const zipOpenToothGroupRef = useRef(null);
  const zipToothMaskRef = useRef(null);
  const zipOpenMaskRef = useRef(null);
  const zipHandleRef = useRef(null);


  const [zipOpenTimelineL] = useState(() => gsap.timeline({ paused: true }));
  const [zipOpenTimelineR] = useState(() => gsap.timeline({ paused: true }));

  useEffect(() => {
    const container = containerRef.current;
    const zipTag = zipTagRef.current;
    const zipOpenToothGroup = zipOpenToothGroupRef.current;
    const zipToothMask = zipToothMaskRef.current;
    const zipOpenMask = zipOpenMaskRef.current;
    const zipHandle = zipHandleRef.current;

    if (!container || !zipTag || !zipOpenToothGroup || !zipToothMask || !zipOpenMask || !zipHandle) {
      console.error('One or more refs are not assigned.');
      return;
    }

    const zipToothMaskInitY = Number(zipToothMask.getAttribute('y'));
    const zipOpenMaskInitY = Number(zipOpenMask.getAttribute('y'));
    const zipOpenMaskHeight = Number(zipOpenMask.getAttribute('height'));

    const minDragY = zipToothMaskInitY;
    const maxDragY = 490;
    const dragLength = maxDragY - minDragY;

    const zipOpenTeethArrayL = [];
    const zipOpenTeethArrayR = [];

    createOpenZipTeeth();

    gsap.set(container, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
    });

    gsap.set(zipTag, {
      x: 280,
      y: zipToothMaskInitY,
    });

    Draggable.create(zipTag, {
      type: 'y',
      bounds: { minY: minDragY, maxY: maxDragY },
      onDrag: onDrag,
      onPress: () => {
        gsap.to(zipHandle, {
          scaleY: 0.7,
          transformOrigin: '50% 0%',
          duration: 0.1,
        });
      },
      onRelease: () => {
        gsap.to(zipHandle, {
          scaleY: 1,
          ease: 'bounce.out',
          duration: 0.3,
        });
      },
      throwProps: true,
      overshootTolerance: 0,
      onThrowUpdate: onDrag,

    });

    function onDrag() {
      gsap.set(zipToothMask, {
        y: this.y - zipToothMaskInitY,
      });

      gsap.set(zipOpenMask, {
        y: (this.y - zipOpenMaskInitY) - zipOpenMaskHeight,
      });

      const percentOpen = (this.y - minDragY) / dragLength;
      zipOpenTimelineL.seek(percentOpen);
      zipOpenTimelineR.seek(percentOpen);
      gsap.set([zipOpenTeethArrayR, zipOpenTeethArrayL], {
        opacity: (percentOpen < 0.1) ? 1 : 0, // Adjust threshold as needed
      });
    }

    function createOpenZipTeeth() {
      const numZipTeeth = 21;
      for (let i = 0; i < numZipTeeth; i++) {
        const ztR = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        ztR.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#zipTooth');
        ztR.setAttribute('x', 295.5);
        const posYR = 156 + (i * 19.05);
        ztR.setAttribute('y', posYR);
        ztR.setAttribute('fill', '#000000');

        const ztL = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        ztL.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#zipTooth');
        ztL.setAttribute('x', 288.5);
        const posYL = 165 + (i * 19.05);
        ztL.setAttribute('y', posYL);
        ztL.setAttribute('fill', '#000000');

        zipOpenToothGroup.appendChild(ztL);
        zipOpenToothGroup.appendChild(ztR);

        zipOpenTeethArrayL.push(ztL);
        zipOpenTeethArrayR.push(ztR);
      }

      gsap.set(zipOpenTeethArrayL, {
        svgOrigin: '288.5 270',
      });

      gsap.set(zipOpenTeethArrayR, {
        svgOrigin: '288.5 270',
      });

      gsap.set([zipOpenTeethArrayR[0], zipOpenTeethArrayL[0]], {
        opacity: 0,
      });
    }

    zipOpenTimelineL.staggerTo(zipOpenTeethArrayL, 5, {
      attr: {
        x: '-=450',
      },
      rotation: -123,
    }, 0.06);

    zipOpenTimelineR.staggerTo(zipOpenTeethArrayR, 5, {
      attr: {
        x: '+=450',
      },
      rotation: 123,
    }, 0.06, '-=5');
  }, []);

  return (
    <div ref={containerRef} className="container">
      <svg className="zipSVG" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="600px" height="600px" viewBox="0 0 600 600">
        <defs>
          <marker id="zipToothR" markerWidth="20" markerHeight="8" refX="4" refY="0" markerUnits="userSpaceOnUse" viewBox="0 0 20 8">
            <rect y="0" width="20" height="8" fill="#2d2d2d" />
          </marker>
          <marker id="zipToothL" markerWidth="20" markerHeight="8" refX="8" refY="0" markerUnits="userSpaceOnUse" viewBox="0 0 20 8">
            <rect y="0" width="20" height="8" fill="#2d2d2d" />
          </marker>
          <rect id="zipTooth" y="0" width="20" height="8" fill="#2d2d2d" />
          <clipPath id="zipToothMask">
            <rect ref={zipToothMaskRef} x="282" y="170" width="40" height="500" fill="#FFFFFF" />
          </clipPath>
          <clipPath id="zipOpenMask">
            <rect ref={zipOpenMaskRef} x="0" y="-330" width="500" height="500" fill="#FFFFFF" />
          </clipPath>
        </defs>
        <g ref={zipOpenToothGroupRef} className="zipOpenToothGroup" clipPath="url(#zipOpenMask)"></g>
        <g className={`zipToothGroup`}>
          <polyline clipPath="url(#zipToothMask)" fill="none" strokeMiterlimit="10" points="299.5,156 299.5,175 299.5,194.1 299.5,213.1 299.5,232.2 299.5,251.2 299.5,270.3 299.5,289.3 299.5,308.4 299.5,327.4 299.5,346.5 299.5,365.5 299.5,384.6 299.5,403.6 299.5,422.6 299.5,441.7 299.5,460.7 299.5,479.8 299.5,498.8 299.5,517.9 299.5,536.9 299.5,556" markerMid="url(#zipToothR)" />
          <polyline clipPath="url(#zipToothMask)" fill="none" stroke="none" strokeMiterlimit="10" points="296.5,165 296.5,184 296.5,203.1 296.5,222.1 296.5,241.2 296.5,260.2 296.5,279.3 296.5,298.3 296.5,317.4 296.5,336.4 296.5,355.5 296.5,374.5 296.5,393.6 296.5,412.6 296.5,431.6 296.5,450.7 296.5,469.7 296.5,488.8 296.5,507.8 296.5,526.9 296.5,545.9 296.5,565" markerMid="url(#zipToothL)" />
        </g>
      </svg>
      <svg ref={zipTagRef} className="zipTagSVG" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="44.7px" height="101.7px" viewBox="0 0 44.7 101.7" opacity="1">
        <defs></defs>
        <g id="zipTagGroup">
          <path fill="#2d2d2d" d="M31.4,40.4c-6-0.9-12-0.9-18,0c-3,0.5-6-1.3-6.5-4.2C5.1,27,3.2,17.7,0.2,8.4c-1-2.9,2-6.5,7.1-7.3 c9.8-1.6,20.2-1.6,30.1,0c5.1,0.8,8.1,4.3,7.1,7.3c-3,9.3-4.9,18.6-6.6,27.8C37.3,39.2,34.4,40.9,31.4,40.4z" />
          <path ref={zipHandleRef} className="zipHandle" fill="#2d2d2d" stroke="#EDEDED" strokeMiterlimit="10" d="M9.2,28.7c0,0-1.9,34.8-5.5,54.8c-1.1,9.4,5.2,17.7,18.5,17.7 c12.3,0,20-8.4,18.9-17.7c-3.6-20-5.5-54.8-5.5-54.8H9.2z M22.7,94.5c-6.3,0-11.5-3.7-11.5-8.3c0-4.6,5.1-8.3,11.5-8.3 c6.3,0,11.5,3.7,11.5,8.3C34.2,90.8,29,94.5,22.7,94.5z" />
          <path fill="#EDEDED" d="M23.5,43.5h-2.3c-1.6,0-3-1.3-3-3V6.6c0-1.7,1.4-3,3-3h2.3c1.7,0,3,1.3,3,3v33.9 C26.5,42.2,25.2,43.5,23.5,43.5z" />
        </g>
      </svg>
    </div>
  );
};
export default Zipper;
