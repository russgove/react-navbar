import * as React from 'react';
import { IContextualMenuItem, CommandBar } from 'office-ui-fabric-react';
import styles from './ReactNavbar.module.scss';
import { IReactNavbarProps } from './IReactNavbarProps';
export default class ReactNavbar extends React.Component<IReactNavbarProps, void> {
  private menuitems: Array<IContextualMenuItem>;
  public render(): React.ReactElement<IReactNavbarProps> {
    this.menuitems = [
      {
        key: "1",
        href: "https://mytenenat.sharepoint.com/teams/IT/BPU/",
        name: "BPI",
        title: "BPI",
      }
    ];

    debugger;
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <CommandBar items={this.props.navNodes} >
          </CommandBar>
          <CommandBar items={this.menuitems} >
          </CommandBar>

        </div>
      </div>
    );
  }
}
