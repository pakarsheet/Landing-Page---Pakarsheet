/**
 * Central GSAP registry — import from here, not directly from "gsap/*"
 * Ensures all plugins registered once, no duplicate registration warnings.
 */
import { gsap } from "gsap";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

gsap.registerPlugin(
  CustomBounce,
  CustomEase,
  CustomWiggle,
  Draggable,
  DrawSVGPlugin,
  Flip,
  InertiaPlugin,
  MotionPathPlugin,
  Observer,
  ScrambleTextPlugin,
  ScrollSmoother,
  ScrollToPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
  RoughEase,
  ExpoScaleEase,
  SlowMo
);

export {
  gsap,
  CustomBounce,
  CustomEase,
  CustomWiggle,
  Draggable,
  DrawSVGPlugin,
  Flip,
  InertiaPlugin,
  MotionPathPlugin,
  Observer,
  ScrambleTextPlugin,
  ScrollSmoother,
  ScrollToPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
  RoughEase,
  ExpoScaleEase,
  SlowMo,
};
