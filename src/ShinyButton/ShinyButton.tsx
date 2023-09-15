import { PropsWithChildren } from "react";
import { ShinyButtonMagic } from "./ShinyButtonMagic";
import style from "./shiny.module.css";

interface ShinyButtonProps extends PropsWithChildren {}

export function ShinyButton(props: ShinyButtonProps) {
  return (
    <button className={style["shiny-button"]}>
      <span className={style["shiny-button-text"]}>{props.children}</span>
      <ShinyButtonMagic />
    </button>
  );
}
