#Yuniku Forms

High order components para manejar y facilitar la creación de formularios.

##Install

1. npm install @yuniku/forms --save

##withFormEnhancer
withFormEnhancer es el HOC principal. Incluye todos los HOCS de la librería integrados.
```javascript
withFormEnhancer(
    formName: String,
    onSubmit: (formValues: Object, ownerProps: Object) => {},
    options: Object{
        reduxFormOptions: Object,
        formTitleOptions: Object,
        submitAndCancelButtonsOptions: Object,
        getFieldPropsOptions: Object,
        actionsButtonsOptions: Object,
        without: Array<String>,
    }
): HigherOrderComponent
```
Recibe 3 parámetors:
- formName (string): Nombre que utilizará redux-form para conectar con el reducer. También se utilizará como título si no se configura las opciones. 
- onSubmit (function): Callback para el botón de Submit. 
- options (object): Opciones para configurar cada HOC. Para más información ver las opciones disponibles en cada HOC.

***Ejemplo de una configuración completa***

```javascript
const onSubmit = (formValues, props) => {
    if (props.mode === 'EDIT') { //update
        console.log(">> EDIT onSubmit", formValues, props)
    } else {
        console.log(">> onSubmit", formValues, props)
    }
};


export default compose(
    withFormEnhancer('form-name', onSubmit, {
        reduxFormOptions: {
            reduxFormOptions: {
                //redux form config
            },
            reducerPath: 'String',
        },
        formTitleOptions: {
            title: 'String',
            customFormTitle: (props) => {},
        },
        submitAndCancelButtonsOptions: {
            onSubmitOptions: {
                label: 'String',
                confirmAction: true,
                getButtonProps: (props) => {},
                buttonProps: {},
            },
            onCancelOptions: {
                label: 'String',
                onCancel: (props) => {},
                getButtonProps: (props) => {},
                buttonProps: {},                
            },
        },
        getFieldPropsOptions: {
            fieldProps: {},
            customGetFieldProps: (fieldName, fieldProps, props) => {},
        },
        actionsButtonsOptions: {
            editRoute: 'String' | (props) => {},
            viewRoute: 'String' | (props) => {},
            options: {
                onClearCallback: (props) => {},
                shouldShowEdit: (props) => {},
                onEditCallback: (editRoute, props) => {},
                shouldShowView: (props) => {},
                onViewCallback: (viewRoute, props) => {},
            }
        },
        without: [] //Lista de hocs que no se desean incluir
    }),
)(FormComponent);
```

- without (Array<String>): Array de keys que permite desactivar alguno de los hocs que se integran. Las keys permitidas son:
    - reduxForm
    - title
    - submitAndCancelButtons
    - getFieldProps
    - actionsButtons

##Componentes

###FormHeader

Da el formato básico a las cabeceras de los formularios. Incluye acciones (navegar atrás, limpiar, cambiar de modo).

La forma más sencilla de utilizarlo es realizando un spread de props. FormHeader va a encontrar aquellas que necesita para funcionar.
Por defecto la cabecera se renderiza con la navegación y los botones de acción. El título es wrappeado en H1.

```javascript 1.6
<FormHeader {...props} />
```
Para configurar el wrapper y las acciones podemos utilizar algunas props:

```javascript 1.6
//El componente renderiza como H2, sin botón de navegación.
<FormHeader {...props} titleComponent="h2" backButton={false} />

//El componente utiliza un componente para el wrapper del título. Además añade otras acciones
const CustomTitle = (props) => (
    <h6>
        <a>{props.children}</a>
    </h6>
);

<FormHeader 
  {...props} 
  titleComponent={CustomTitle} 
  actions={[
      props.renderClearButton(),
      <button>Custom Action</button>
  ]}
/>
```

***Proptypes***

| PropTypes                     | Type          | Default | Description |
| :----------------------------:|:-------------:| :------:| -----------:|
| flexProps                     | Object        | -       | Objeto de configuración para el componente de layout Flex
| title                         | String        | -       | Título a renderizar.
| renderFormTitleWithBackButton | Function      | -       | Función que se obtiene usando withFormHeader. Genera el título con un botón de navegación que ejectu un POP en el click.  
| titleComponent                | String - Node | h1      | Define el componente que va a wrappear los títulos.   
| backButton                    | Boolean       | true    | Define si debe mostrar o no el back button.   
| renderClearButton             | Function      | -       | Función que se obtiene usando witActionsButtons. Genera el botón para limpiar el formulario.  
| renderEditButton              | Function      | -       | Función que se obtiene usando witActionsButtons. Genera el botón para cambiar a Edit Mode.  
| renderViewButton              | Function      | -       | Función que se obtiene usando witActionsButtons. Genera el botón para cambiar a View Mode.  
| actions                       | Node          | -       | Elemento/s a renderizar en lugar del botón de clear, edit y view.  

###FormFooter

Da formato básico al footer del formulario. Incluye los botones de submit y cancel.

La forma más sencilla de utilizarlo es realizando un spread de props. FormFooter va a encontrar aquellas que necesita para funcionar.
Por defecto renderiza los botones de cancel y submit y los acomoda a la derecha del formulario. Además le da margen al botón cancel. La ubicación puede ser configurada utilizando las flexProps.

***Proptypes***

| PropTypes                     | Type          | Default | Description |
| :----------------------------:|:-------------:| :------:| -----------:|
| flexProps                     | Object        | -       | Objeto de configuración para el componente de layout Flex  
| renderSubmitButton            | Function      | -       | Función que se obtiene usando withSubmitAndCancelButtons. Genera el botón de submit.  
| renderCancelButton            | Function      | -       | Función que se obtiene usando withSubmitAndCancelButtons. Genera el botón de cancel.  
| actions                       | Node          | -       | Elemento/s a renderizar en lugar del botón de clear, edit y view.  

***FlexProps***

| PropTypes  | Type   | 
| :---------:|:------:| 
| padding    | String |
| margin     | String |
| background | String |
| width      | String |
| align      | String |
| justify    | String |
| direction  | String |
| flex       | String |

##HOCS Disponibles

- [withReduxForm](#withReduxForm)
- [withFormTitle](#withFormTitle)
- [withSubmitAndCancelButtons](#withSubmitAndCancelButtons)
- [withGetFieldProps](#withGetFieldProps)
- [withActionsButtons](#withActionsButtons)

###withReduxForm
```javascript
withReduxForm(
    formName: String,
    options: Object{reduxFormOptions: Object, reducerPath: String},
): HigherOrderComponent
```
Conecta el componente a ReduxForm. La mayoría de los HOCs utilizan props que se obtienen de redux-form, por lo que esta función debe ser la primera en el orden del compose.

Recibe 2 parámetros:
- formName (string): ***requerido***. Nombre que utilizará el form en el reducer. por defecto se utilizará el ***formName*** para acceder al reducer y obtener los valores iniciales. 
- options (object): 
    - reduxFormOptions: Opciones disponibles en redux-form. Son mapeadas directamente al conector.
    - reducerPath: sobreescribe el path a utilizar en la función que selecciona los valores iniciales del reducer.   


InitialValues: withReduxForm es el encargado de establecer los valores iniciales al formulario utilizando la prop ***initialValues***.
withReduxForm intentará precargar los valores accediendo al reducer y seleccionando parte del estado a través del ID de la entidad. Para ello utilizará el ***formName*** como referencia al PATH del reducer. Este path puede ser configurado utilizando la opcion ***reducerPath***

El componente envuelto tiene la habilidad de utilizar otros initialValues. Para ello deberá pasar initialValues como prop antes de utilizar withReduxForm:

```javascript
const mapStateToProps = (state) => {
    //Estos valores serán usados como valores iniciales
    initialValues: {
        firstName: 'Pepi'
    } 
};

//Para lograr sobreescribir los valores es importante que la prop initialValue sea cargada previamente. 
export default compose(
    conect(mapStateToProps),
    withReduxForm('myForm'),    
)(FormComponent)
```  
Devueve todas las props provistas por redux-form.

###withFormTitle
Genera el título del formulario. 

```javascript
withFormTitle(
  title: String,
  customFormTitle: (ownerProps: Object) => String,
): HigherOrderComponent
```

Recibe 2 parámetros:
- title (string): Texto para el título. El resultado final contendrá el modo delante del texto. Ej: 'Add User';
- customFormTitle (function): Función para generar un título customizado. La función será llamada con las props del componente envuelto como único parámetro.

Inyecta dos props al componente:

- ***formTitle*** (string): El título formateado según el modo o de acuerdo a la función provista. 
- ***renderFormTitleWithBackButton*** (function): El título según el modo o la función provista, junto con el ícono de navegación.

```javascript
const customTitle = (props) => {
    switch (props.mode) {
        case ADD:
            return 'Add Lead';
            break;
        case VIEW:
            return `${props.initialValues.firstName} ${props.initialValues.lastName}`;
            break;
        case EDIT:
            return `Edit ${props.initialValues.firstName} ${props.initialValues.lastName}`;
            break;
    }
};

export default compose(
    withReduxForm(NAME),
    withFormTitle('Lead', customTitle),   
)(FormComponent)
```

###withSubmitAndCancelButtons
Genera los botones de acciones para el formulario.
```javascript 1.6
withSubmitAndCancelButtons(
  onSubmitCallback: (formValues: Object, ownerProps: Object) => {},         
  onSubmitOptions: Object{label: String, confirmAction: boolean, buttonProps: Object, getButtonProps: (ownerProps: Object)},
  onCancelOptions: Object{label: String, onCancel: () => {}, buttonProps: Object, getButtonProps: (ownerProps: Object)},
): HigherOrderComponent
```

Recibe 3 parámetros:
- onSubmit (function): Función a ejecutar en el submit (sea edit o add). La función será llamada con los datos del formulario y las props del componente envuelto: function(data, props)
- onSubmitOptions (object): 
    - label (string): El label a ser usado en el botón. Si no se provee se utiliza una función que genera el label de manera automática según el ***mode*** del form.     
    - confirmAction (boolean): Determina si se dispara o no el dialog de confimación. Por defecto se activará siempre que el mode sea EDIT.
    - buttonProps (object): Props que será pasadas al botón de submit. 
    - getButtonProps (function): Permite utilizar un callback para generar las props para el botón. La función es llamada con las props del component envuelto como único parámetro. Si se declara esta opción buttonProps no tiene efecto. 

- onCancelOptions (object):
    - label (string): El label a ser usado en el botón. Si no se provee se utiliza 'Cancel' por defecto.  
    - onCancel (function): Función a ejecutar en el cancel. De no ser declarada Navigation.pop se utiliza por defecto.    
    - buttonProps (object): Props que será pasadas al botón de cancel. 
    - getButtonProps (function): Permite utilizar un callback para generar las props para el botón. La función es llamada con las props del component envuelto como único parámetro. Si se declara esta opción buttonProps no tiene efecto.

Inyecta dos props al componente:

- ***renderSubmitButton*** (function): Renderiza el botón de submit. El label del boton puede ser configurado mediante las opciones. Si confirmAction es true el diálogo de confirmación se desplegará en lugar del submit. La acción será completada dentro del dialog. La función acepta un objeto con estilos JS que son pasados al root del botón.  
- ***renderCancelButton*** (function): Renderiza el botón para cancelar el formulario. Una acción puede ser pasada a través de las opciones. Por defecto navega a la pantalla anterior en el stack de navegación del browser. La función acepta un objeto con estilos JS que son pasados al root del botón.


```javascript
const onSubmit = (data, props) => {
    if (props.mode === 'EDIT') { //update
        console.log(">> EDIT onSubmit", data, props)
    } else {
        console.log(">> onSubmit", data, props)
    }
};

export default compose(
     withReduxForm(NAME),
     withSubmitAndCancelButtons(
         onSubmit,
         {
             confirmAction: true,
         },
         {
             buttonProps: {
                 disabled: true,
             }
         }
     ),
)(FormComponent)
```
###withGetFieldProps

```javascript
withGetFieldProps(
  fieldProps: Object,
  customGetFieldProps: (fieldName: String, fieldProps: Object, ownerProps: Object) => Object,
): HigherOrderComponent
```

Genera la función para dar props a los fields de un formulario.

Retorna:
- getFieldProps (function): Una función que acepta el nombre de field. Luego se utiliza para mapear con ***fieldProps***. El resultado será props genéricas de los fields junto con las declaradas en fieldsProps:   

```javascript
return {
        name: field,
        component: TextField,
        fullWidth: true,
        disabled: props.mode === VIEW,
        margin: 'dense',
        ...fieldProps[field],
}
```

###withActionsButtons

Genera botones de acción dentro del form: clear, edit mode, view mode. 
```javascript
withActionsButtons(
  editRoute: String | (ownerProps: Object) => {},
  viewRoute: String | (ownerProps: Object) => {},
  options: Object {
      onClearCallback: (ownerProps: Object) => {},
      shouldShowEdit: (ownerProps: Object) => Boolean,
      onEditCallback: (editRoute: String, ownerProps: Object) => {},
      shouldShowView: (ownerProps: Object) => Boolean,
      onViewCallback: (editRoute: String, ownerProps: Object) => {},
  }
): HigherOrderComponent
```
Recibe 3 parámetros:
- editRoute (string): Ruta a la que se navega con el botón de Edit Mode. 
- viewRoute (string): Ruta a la que se navega con el botón de View Mode.
- options (object): 
    - onClearCallback: Callback que se ejecuta luego de limpiar el formulario. Útil en los casos en los que haya que eliminar datos del reducer de manera manual. La función se llama con las props del component envuelto como único parámetro. 
    - shouldShowEdit: Callback para determinar si debe mostrarse el boton de edit mode. Por defecto los botones se ocultan basados en la ruta.  La función se llama con las props del component envuelto como único parámetro.
    - onEditCallback: Callback que se ejecuta en el click del botón de edit mode. Por defecto se intenta navegar utilizando la prop history del componente. La función se llama con la ruta de edit y las props del component envuelto como parámetros.
    - shouldShowView: Callback para determinar si debe mostrarse el boton de view mode. Por defecto los botones se ocultan basados en la ruta.  La función se llama con las props del component envuelto como único parámetro.
    - onViewCallback: Callback que se ejecuta en el click del botón de view mode. Por defecto se intenta navegar utilizando la prop history del componente. La función se llama con la ruta de view y las props del component envuelto como parámetros.

El componente se retorna con 3 props nuevas:
- renderClearButton (function): Genera el botón para resetear el formulario a su estado inicial.   
- renderEditButton (function): Genera el botón para navegar al modo edición. No se muestra si el form se encuentra en modo edit.    
- renderViewButton (function): Genera el botón para navegar al modo vista. No se muestra si el form se encuentra en modo view.    
