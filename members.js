const db = firebase.firestore();
const users = db.collection('users');

const firstNameUser = async user => {
    const doc = await users.doc(user).get();
    if (doc.exists) {
        return doc.data().firstName;
    } else {
        return 'user not found';
    }
}

const getUsers = async () => {
    const querySnapshot = await users.where('email', '>=', 1000000).orderBy('email', 'asc').limit(10).get();
    let list = [];
    querySnapshot.forEach(doc => list.push({
      name: doc.id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      email: doc.data().email,
      role: doc.data().role
    }));
    return list;
}

users.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        switch(change.type){
            case 'added':
                userAdded({
                  name: change.doc.id,
                  firstName: change.doc.data().firstName,
                  lastName: change.doc.data().lastName, 
                  email: change.doc.data().email,
                  role: change.doc.data().role
                });
                break;
            case 'modified':
                userUpdated({
                  name: change.doc.id,
                  firstName: change.doc.data().firstName,
                  lastName: change.doc.data().lastName, 
                  email: change.doc.data().email,
                  role: change.doc.data().role
                });
                break;
            case 'removed':
                userRemoved(change.doc.id);
                break;
        }
    })
})

const usersDiv = $('#all-users');

const userAdded = function userAdded(user) {

  //create update modal
  const updateModal ='<div class="update-modal"><div class="update-modal-container"><div id="createUserForm" class="create-user-form w-form"><form id="Create-User-Form" name="wf-form-Create-User-Form" data-name="Create User Form"><div class="update__header"><h2 class="heading">Update member</h2><p class="email__support">Since you are an admin, you have been granted permission to update users within your system.</p></div><div class="form__row"><div class="form__row-half"><input type="text" class="form__text-field w-input" maxlength="256" value=' + `${user.firstName}` +' name="firstNameNewUser" data-name="First Name New User" required=""></div><div class="form__row-half"><input type="text" class="form__text-field w-input" maxlength="256" value=' + `${user.lastName}` +' name="lastNameNewUser" data-name="Last Name New User" placeholder="Last Name" required=""></div></div><div class="form__row"><input type="email" class="form__text-field w-input" value=' + `${user.email}` +' maxlength="256" name="emailNewUser" data-name="Email New User" required=""></div><div class="user-role-text">User Role*:</div><div class="user-roles"><label class="radio-btn-field w-radio"><div class="w-form-formradioinput w-form-formradioinput--inputType-custom radio-btn w-radio-input"></div><input type="radio" data-name="Role" name="Role" value="admin" required="" style="opacity:0;position:absolute;z-index:-1"><span for="admin" class="w-form-label">Purchase Access</span></label><label class="radio-btn-field w-radio"><div class="w-form-formradioinput w-form-formradioinput--inputType-custom radio-btn w-radio-input"></div><input type="radio" data-name="Role" name="Role" value="nonadmin" required="" style="opacity:0;position:absolute;z-index:-1"><span for="nonadmin" class="radio-btn-label w-form-label">No Purchase Access</span></label></div><div class="modal-btn-container"><a href="#" class="btn update-user" target="_blank" rel="noreferrer">Update User</a><a href="#" class="btn secondary cancel-update" target="_blank" rel="noreferrer">Cancel</a></div></form><div class="success-message w-form-done"><div>Thank you! Your submission has been received!</div></div><div class="w-form-fail"><div>Oops! Something went wrong while submitting the form.</div></div></div></div></div>'
  //create delete modal 
  const deleteModal = '<div class="delete-modal"><div class="delete-modal-container"><div>Are you sure you want to delete <span id="email-in-modal" class="text-span">' + `${user.email}` + '</span>? This cannot be undone.</div><div class="modal-btn-container"><div class="login-btn__wrapper"><div id="loginAnimation" class="btn login lottie"><div data-w-id="5fd18289-e0de-8a21-c2e8-04906396dc60" data-animation-type="lottie" data-src="https://global-uploads.webflow.com/5d4d6f535c8980fa69c631f3/5eb3196ff7d1ccf8dc6d9f04_lf30_editor_kPNvqs.json" data-loop="1" data-direction="1" data-autoplay="1" data-is-ix2-target="0" data-renderer="svg" data-default-duration="2.0020019204587935" data-duration="0" class="lottie-animation-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><defs><clipPath id="__lottie_element_2"><rect width="100" height="100" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_2)"><g transform="matrix(1,0,0,1,-110,-234)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(-0.9874391555786133,-0.1579996943473816,0.1579996943473816,-0.9874391555786133,160,284)"><path stroke-linecap="round" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="10" d=" M36,0 C36,-19.881999969482422 19.881999969482422,-36 0,-36 C-19.881999969482422,-36 -36,-19.881999969482422 -36,0 C-36,17.844999313354492 -23.014999389648438,32.65800094604492 -5.979000091552734,35.50600051879883"></path></g></g></g></svg></div></div><a href="#" class="btn delete-user w-button" target="_blank" rel="noreferrer">Delete</a></div><a href="#" class="btn secondary cancel-delete w-button" target="_blank" rel="noreferrer">Cancel</a></div></div></div>'
  //create user row 
  const userRow = '<div class="users-row"><div class="users-info"><div class="users-name"><span class="users-firstname">' + `${user.firstName}` + '</span> <span class="users-lastname">' + `${user.lastName}` + '</span></div><div class="users-email">' + `${user.email}` + '</div><div class="users-id">' + `${user.name}` + '</div><div class="users-role">' + `${user.role}` + '</div><div class="created-date">Created: <strong>' + `${user.timestamp}` + '</strong></div></div><div class="users-actions"><a href="#" class="btn update w-button" target="_blank" rel="noreferrer">Update</a><a href="#" class="btn delete w-button" target="_blank" rel="noreferrer">Delete</a>' + deleteModal + updateModal + '</div></div>'

  //get value of each users role (radio buttons)
  $(updateModal).each(function() {
    var adminVal = $('input[value=admin]').val();
    var nonAdminVal = $('input[value=nonadmin]').val();
    var admin = $('input[value=admin]');
    var nonAdmin = $('input[value=nonadmin]');
    if (user.role === adminVal) {
      $(admin).prop('checked', true);
      $(admin).siblings('.w-form-formradioinput').addClass('w--redirected-checked');
      $(nonAdmin).siblings('.w-form-formradioinput').removeClass('w--redirected-checked');
      $(nonAdmin).prop('checked', false);
    } else if (user.role === nonAdminVal) {
      $(admin).prop('checked', false);
      $(nonAdmin).prop('checked', true);
      $(nonAdmin).siblings('.w-form-formradioinput').addClass('w--redirected-checked');
      $(admin).siblings('.w-form-formradioinput').removeClass('w--redirected-checked');
    } else {
      console.log('no value has been assigned to the user');
    }     
  });

  //$(updateModal).find('input[name=Role]').append(checkValue);

  //open delete modal and set props equal to each row   
  $('.delete').click(function() {
    var e = $(this).siblings(".delete-modal");
    e.show();
  });
  $('.delete-user').click(function() {
    deleteUser(user.name);
    //$(this).parents('.users-row').remove();
  });
  $('.cancel-delete').click(function() {
    $(this).parents(".delete-modal").hide();
  });
  
  //trigger update modal and its actions
  $('.update').click(function() {
    var e = $(this).siblings(".update-modal");
    e.show();  
  })
  $('.update-user').click(function(){
    updateUser(user.name, user.firstName);
    $(this).parents(".update-modal").hide();
  });
  $('.cancel-update').click(function() {
    $(".update-modal").hide();
  });
  
  //append items dynamically
  $(usersDiv).append(userRow);
}

const userUpdated = user => {
    $('#' + user.name).text(`${user.name}`);
}

const userRemoved = name => {
    $('#' + name).remove();
}

const updateUser = (user, firstName) => {
    $('.update-user').hide();
    $('.cancel-update').hide();
    users.doc(user).update({
        firstName: firstName,
        //lastName: lastName,
        //email: email,
        //role: role,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function() {
            console.log('successfully updated user');
            $('.update-user').show();
            $('.cancel-update').show();
            $('.update-user').parents('.update-modal').hide();
          })
          .catch(function() {
            console.log('could not update the user');
            $('.update-user').show()
            $('.cancel-update').show();;
          });
}

const deleteUser = user => {
    $('.delete-user').hide();
    $('.cancel-delete').hide();
    users.doc(user).delete()
    .then(function() {
            console.log('successfully deleted user');
            $('.delete-user').show();
            $('.cancel-delete').show();
            $('.delete-user').parents('.users-row').remove();
          })
          .catch(function() {
            console.log('could not delete the user');
            $('.delete-user').show();
            $('.cancel-delete').show();
          });
}
