This repository contains the code for the JWT Provider used in [HoloCollab](https://github.com/Holo-Repository/MSTeams-WebApp).


# Fluid JWT Provider

The Fluid JWT Provider is an Azure Function written in TypeScript that runs a service which returns signed JWT token to authorize requests to the Fluid Relay.

## Provisioning

All the necessary provisioning steps are performed automatically in the [Provisioning](https://github.com/Holo-Repository/MSTeams-WebApp/tree/main#provisioning-1) section of the parent HoloCollab app.

The result is a properly configured function app inside the parent Azure subscription.

## Deployment

To deploy the app on Azure, open the [Azure Portal](https://portal.azure.com/) and navigate to the function app created in the previous step.

Then select the `Deployment Center` tab and choose `GitHub` as the source control provider and follow the steps to connect the function app to this repository.

## Caveats

Due to the way the Azure Functions work, they require a unique name and might give an error in case the name is already used.

In case this happens, substitute the name of the function app in the `Provisioning` section of the parent HoloCollab app with a unique name.

The name can be found at the top of the `.BICEP` file in [`infra/`](https://github.com/Holo-Repository/MSTeams-WebApp/blob/main/infra/azure.bicep).

The corresponding connection string for the app also needs to be updated in the `ContainerManager` class in [`ContainerManager.ts`](https://github.com/Holo-Repository/MSTeams-WebApp/blob/main/src/routes/containers/ContainerManager.ts) in the constructor in the props passed to the `AzureClient`.