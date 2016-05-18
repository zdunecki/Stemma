var stemmaAPP = (function(){


    var stemmaLittleLibService = (function(){
        function littleLib(){

        }
        littleLib.prototype.areInArray = function (check,In){
          var found = false;
          for (var i = 0; i < check.length; i++) {
              if (In.indexOf(check[i]) > -1) {
                  found = true;
                  break;
              }
          }
          return found;
        }

        littleLib.prototype.acceptable = function(check,In){

          var point = 0;

          for (var i = 0; i < In.length; i++) {
            for(var c = 0; c<check.length; c++){
              In[i] === check[c] ? point++ : null;
            }
          }
          return point === In.length ? true : false;

        }

        return littleLib;
    }());

    var stemmaLibService = (function(){
            //stemma lib service
            function stemmaLib(checkboxContainer,stemmaOptions){
              this.checkboxContainer = checkboxContainer;
              this.stemmaOptions = stemmaOptions;
            }

            stemmaLib.prototype.getAllElementsWithAttribute = function(attribute){
                var result = [];
                var allElements = this.checkboxContainer.getElementsByTagName('*');

                for (var i = 0, n = allElements.length; i < n; i++)
                {
                  if (allElements[i].getAttribute(attribute) !== null)
                  {
                    result.push(allElements[i]);
                  }
                }
                return result;
            }

            stemmaLib.prototype.findElement = function(dataAttr,dataAttrProp){
              var result = [];
              for(i=0;i<this.getAllElementsWithAttribute(dataAttr).length;i++){
                this.getAllElementsWithAttribute(dataAttr)[i].getAttribute(dataAttr) === dataAttrProp ? result.push(this.getAllElementsWithAttribute(dataAttr)[i]) : null
              };
              return result.length > 0 ? result : null;
            }

            stemmaLib.prototype.searchAlg = function(root,options,cb){

               var attr = root.getAttribute(options.attribute);
               
               var allAttrElement = this.findElement(options.find,attr);
               
               var self = this;
               if(allAttrElement != null){
                  allAttrElement.map(function(v,k){
                    self.searchAlg(v,options,cb);
                  });
                  for(i=0;i<allAttrElement.length;i++){
                    cb(allAttrElement[i]);
                  }
               } 

            }

            stemmaLib.prototype.emitAlg = function(emitArr,searchIn){
                var self = this;
                emitArr.map(function(el,k){

                  if(el.getAttribute('data-child') == searchIn){

                    var childrens = el.getAttribute('data-child');
                    var find = self.findElement('data-mine-parent',childrens);

                    find.every(self.allTrue) ? el.checked = true : el.checked = false;
                    self.emitAlg(emitArr,el.getAttribute('data-mine-parent'));
                  };
                });
            }

            stemmaLib.prototype.allTrue = function(value){
              return value.checked == true;
            }
            return stemmaLib;
    }());

    var checkboxesService = (function(){
          //checkboxes service
          function checkboxes(node){

              this.checkbox = node.querySelectorAll("input[type=checkbox]");
              this.list = node.querySelectorAll("ul");

              this.onClick = function(initAction){
                for(i=0;i<this.checkbox.length;i++){
                  this.checkbox[i].onclick = initAction;
                };
              };
              this.setListStyleType = function(){
                for(i=0;i<this.list.length;i++){
                  this.list[i].style.listStyleType = "none";
                }
              };
              this.setAttribute = function(){
                for(i=0;i<this.checkbox.length;i++){
                  if(this.checkbox[i].hasAttribute('data-child'))
                    this.checkbox[i].setAttribute('id',node.id+"-"+this.checkbox[i].getAttribute('data-child'));
                  }
              }

              //this.setAttribute();
              this.setListStyleType();
          }
          return checkboxes;
    }());


    var stemmaFromObjectService = (function(){
      function createStemma(mount,options){
              this.mainUl = document.createElement("UL");
              this.mount = mount;
              this.obj = options.data;

              for(this.prop in this.obj){
                var parseProp = parseInt(this.prop);
                var childLength = this.obj[this.prop].child.split("-").length; 

                childLength === 1 ? this.forFirst() : null;

                if(this.obj[this.prop-1] != undefined){
                  var previousChild = this.obj[parseProp-1].child.split("-").length;
                  childLength != previousChild ? this.breakUl() : childLength != 1 ? this.ulLiRoot() : null;
                }

              }

              function setID(){
                 var mainUlCheckbox =  this.mainUl.querySelectorAll("input[type=checkbox]");
                 for(i=0;i<mainUlCheckbox.length;i++){
                    if(mainUlCheckbox[i].hasAttribute('data-child'))
                      mainUlCheckbox[i].setAttribute('id',this.mount.id+"-"+mainUlCheckbox[i].getAttribute('data-child'));
                }
              }
              setID.call(this);

              mount.appendChild(this.mainUl);

      }
      createStemma.prototype.forFirst = function(){

                  //for first broadcast li
                  var li1 = document.createElement("li");
                  li1.id = mount.id+"-"+"li-"+this.obj[this.prop].child;

                  //for first broadcast input
                  var input1 = document.createElement("INPUT");
                  input1.type = "checkbox";
                  this.obj[this.prop].hasOwnProperty("mineparent") ? input1.setAttribute("data-mine-parent",this.obj[this.prop].mineparent) : null;
                  input1.setAttribute("data-child",this.obj[this.prop].child);
                  input1.id = this.obj[this.prop].child;

                  //for first broadcast label
                  var label1 = document.createElement("LABEL");
                  var label1text = document.createTextNode(this.obj[this.prop].text);
                  label1.setAttribute("for",mount.id+"-"+input1.id);
                  label1.appendChild(label1text);

                  
                  li1.appendChild(input1);
                  li1.appendChild(label1);
                  this.mainUl.appendChild(li1);
      }

      createStemma.prototype.breakUl = function(){

                    this.ul =  document.createElement("UL");
                    var li2 = document.createElement("LI");
                    li2.id =  mount.id+"-"+"li-"+this.obj[this.prop].child;

                    //for ul break emit input
                    var input2 = document.createElement("INPUT");
                    input2.type = "checkbox";
                    this.obj[this.prop].hasOwnProperty("mineparent") ? input2.setAttribute("data-mine-parent",this.obj[this.prop].mineparent) : null;
                    input2.setAttribute("data-child",this.obj[this.prop].child);
                    input2.id = this.obj[this.prop].child;

                    //for ul break emit label
                    var label2 = document.createElement("LABEL");
                    var label2text = document.createTextNode(this.obj[this.prop].text);
                    label2.setAttribute("for",mount.id+"-"+input2.id);
                    label2.appendChild(label2text);

                    li2.appendChild(input2);
                    li2.appendChild(label2);
                    this.ul.appendChild(li2);
                    
                    if( this.mainUl.querySelector("#"+mount.id+"-li-"+this.obj[this.prop].mineparent) != null){
                      var appendTo = this.mainUl.querySelector("#"+mount.id+"-li-"+this.obj[this.prop].mineparent);
                      appendTo.parentNode.appendChild(this.ul)
                    };
      }

      createStemma.prototype.ulLiRoot = function(){

                      var li3 = document.createElement("LI");
                      var li3node = document.createTextNode(this.obj[this.prop].text);
                      li3.id = mount.id+"-"+"li-"+this.obj[this.prop].child;

                      //for ul li root emit input
                      var input3 = document.createElement("INPUT");
                      input3.type = "checkbox";
                      this.obj[this.prop].hasOwnProperty("mineparent") ? input3.setAttribute("data-mine-parent",this.obj[this.prop].mineparent) : null;
                      input3.setAttribute("data-child",this.obj[this.prop].child);
                      input3.id = this.obj[this.prop].child;

                      //for ul li root emit label
                      var label3 = document.createElement("LABEL");
                      var label3text = document.createTextNode(this.obj[this.prop].text);
                      label3.setAttribute("for",mount.id+"-"+input3.id);
                      label3.appendChild(label3text);

                      li3.appendChild(input3);
                      li3.appendChild(label3);
                      this.ul.appendChild(li3);
      }

      return createStemma;

}());


    var stemmaOptionService = (function(stemmaLittleLibService){

      function optionService(options){

        this.options = options;
        this.acceptableProps = ['data'];

        var smallLib = new stemmaLittleLibService;

        this.areOptions = function(){
          return  this.isOption = typeof options != 'undefined' ? true : false;
        }.call(this);

        this.isOption ? this.check = Object.keys(options) : null;

        this.checkAcceptableProps = function(){
          this.check != undefined ? smallLib.acceptable(this.acceptableProps,this.check) ?  null : console.error('wrong props, acceptable props: '+this.acceptableProps) : null;
        }.call(this);
        
      }
      return optionService;

    }(stemmaLittleLibService));


    var stemmaController = (function(libService,checkboxService,stemmaOptionService,stemmaFromObjectService){

        //checkboxTree
        
        function stemmaCheckboxes(container,options){
          if(container == undefined){
            console.error('mount is required');
            return false;
          }else{


          this.options = options; // options
          this.container = container; //checkbox container

          
          var optionService = new stemmaOptionService(options);

           if(optionService.isOption){
              if(this.options.hasOwnProperty("data"))
                var stemmaFromOb = new stemmaFromObjectService(this.container,this.options);
            };

          this.checkboxesLib = new libService(this.container,this.options); //lib for checkbox
          
          var self = this;

          var checkbox = new checkboxService(this.container); //checkbox events
            checkbox.onClick(function(e){
              return self.onClick(this);
            });

          }
        }

        stemmaCheckboxes.prototype.onClick = function(clicked){
          var requiredAttr = clicked.hasAttribute('data-child') || clicked.hasAttribute('data-mine-parent');
          this.clickedElement = clicked;
          requiredAttr ? this.letsRock() : console.error('Invalid attrs, required attr is data-child or data-mine-parent');
        }

        stemmaCheckboxes.prototype.letsRock = function(){
                this.broadcast = [];
                this.emit = [];

                var self = this;
                var options = {
                    broadcast:{
                      attribute:'data-child',
                      find:'data-mine-parent'
                    },
                    emit:{
                      attribute:'data-mine-parent',
                      find:'data-child'
                    }
                  };
                
                this.checkboxesLib.searchAlg(this.clickedElement,options.broadcast,function(broadcast){
                  self.broadcast.push(broadcast);
                  console.log(broadcast,'<-- bradcast');
                });

                this.checkboxesLib.searchAlg(this.clickedElement,options.emit,function(emit){
                  self.emit.push(emit);
                  console.log(emit,'<-- emit');
                });

                this.broadcastAction();
                this.emitAction();
                
        }

        stemmaCheckboxes.prototype.broadcastAction = function(){
              for(i=0;i<this.broadcast.length;i++){
                  this.clickedElement.checked == true ? this.broadcast[i].checked = true : this.broadcast[i].checked = false;
              };
        }

        stemmaCheckboxes.prototype.emitAction = function(){
                var clickedData = {
                  parent:this.clickedElement.getAttribute('data-mine-parent'),
                  child:this.clickedElement.getAttribute('data-child')
                };
                this.checkboxesLib.emitAlg(this.emit,clickedData.parent);
        }

        return {
          stemmaCheckboxes:stemmaCheckboxes
        }

    }(stemmaLibService,checkboxesService,stemmaOptionService,stemmaFromObjectService));

  return stemmaController;

}());

var Stemma = stemmaAPP.stemmaCheckboxes;




