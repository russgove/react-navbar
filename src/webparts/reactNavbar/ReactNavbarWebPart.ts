import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as pnp from 'sp-pnp-js';
import NavNode from "./NavNode";
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'reactNavbarStrings';
import ReactNavbar from './components/ReactNavbar';
import { IReactNavbarProps } from './components/IReactNavbarProps';
import { IReactNavbarWebPartProps } from './IReactNavbarWebPartProps';

export default class ReactNavbarWebPart extends BaseClientSideWebPart<IReactNavbarWebPartProps> {
  /* gets a property from an item in the seacrh results */
  public getProperty(site, propertyName) {
    for (const cell of site.Cells) {
      if (cell.Key === propertyName) {
        return cell.Value
      }
    }
  };
  /* create update global Nav witgh the search results */
  private findSubWebsForWeb(sites: Array<pnp.SearchResult>, parentLink) {
    var roots = sites.filter((site: pnp.SearchResult) => {
      var thisParent = this.getProperty(site, "ParentLink");
      return (thisParent === parentLink);
    }).map((node: pnp.SearchResult) => {
      return new NavNode(
        this.getProperty(node, "Path"), // using path as Id for now
        this.getProperty(node, "Title"),
        this.getProperty(node, "Path"),
        parentLink,
        this.getProperty(node, "Description"),

      );
    });
    return roots;
  };
  /* fill in child ndes for a site */
  private fillSubsites = function (sites: pnp.SearchResults, site: NavNode, level: number) {

    site.subwebs = this.findSubWebsForWeb(sites, site.path);
    for (let subweb of site.subwebs) {
      this.fillSubsites(sites, subweb, level + 1)
    }
  };
  public convertsitesToTree(sites): any {
    const rootNodes = this.findSubWebsForWeb(sites, this.context.pageContext.site.absoluteUrl);
    for (const rootNode of rootNodes) {
      this.fillSubsites(sites, rootNode, 1)
    }
    return rootNodes;
  }
  public getNavNodes(): Promise<any> {
    const root = this.context.pageContext.site.absoluteUrl;
    const queryText = "'contentClass=\"STS_Web\"+path:" + root + "'&trimduplicates=false&rowlimit=300&selectProperties='Title,Path,Description,ParentLink'&SortList='refinablestring00:ascending'";
    let query: pnp.SearchQuery = {
      "Querytext": "contentClass=\"STS_Web\"+path:\"" + root + "\"",
      "TrimDuplicates": false,
      "RowLimit": 300,
      "SelectProperties": [
        "Title", "Path", "Description", "ParentLink",
      ],

      "SortList":
      [
        {
          "Property": "refinablestring00", // need to map Title to refinablestring00 and make it sortable
          "Direction": pnp.SortDirection.Ascending
        },

      ],
    };
    return pnp.sp.search(query).then(results => {
      const tree = this.convertsitesToTree(results.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows);
      debugger;
    });
  }
  public render(): void {
    debugger;
    const navNodes = this.getNavNodes();
    const element: React.ReactElement<IReactNavbarProps> = React.createElement(
      ReactNavbar,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
