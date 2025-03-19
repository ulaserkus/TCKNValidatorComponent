import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import IdentityValidator from "./Components/identityValidator";

export class TurkishIdentityNoValidator implements ComponentFramework.StandardControl<IInputs, IOutputs> {
   
    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;
    private tckn: string;
    private name: string;
    private surname: string;
    private birthYear: string;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        this.tckn = context.parameters.tckn.raw || "";
        this.name = context.parameters.name.raw || "";
        this.surname = context.parameters.surname.raw || "";
        this.birthYear = context.parameters.birthYear.raw || "";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        ReactDOM.render(
            React.createElement(IdentityValidator, {
                context,
                tckn: this.tckn,
                name: this.name,
                surname: this.surname,
                birthYear: this.birthYear,
                onChange: this.handleFieldChange.bind(this)
            }),
            this.container
        );
    }

    public getOutputs(): IOutputs {
        return {
            tckn: this.tckn,
            name: this.name,
            surname: this.surname,
            birthYear: this.birthYear
        };
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container);
    }

    private handleFieldChange(fieldName: string, value: string): void {
        switch (fieldName) {
            case "tckn":
                this.tckn = value;
                break;
            case "name":
                this.name = value;
                break;
            case "surname":
                this.surname = value;
                break;
            case "birthYear":
                this.birthYear = value;
                break;
        }

        this.notifyOutputChanged();
    }
}