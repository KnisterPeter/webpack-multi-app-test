import * as React from "react";
import { Plugin } from "core";
import { App } from "./app";

export default class AppPlugin implements Plugin {
  public main: React.ComponentType = App;
}
