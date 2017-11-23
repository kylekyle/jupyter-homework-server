console.log('jupyter-homework: notebook server hook loaded');

require(['nbextensions/jupyter-homework/bootbox.min','nbextensions/jupyter-homework/common'], function(bootbox, homework) {
  homework.config(function(conf) {
    $('#hwMenu').append($('<li/>').append(
      $('<a/>')
        .attr('href','#')
        .text('Submit this notebook')
        .click(function() {
          bootbox.dialog({
            title: 'Confirm Submission',
            message: 'You only get one submission per assignment. Are you sure you are ready to submit?',    
            buttons: {
              cancel: {
                label: 'No',
                className: 'btn-danger'
              },
              confirm: {
                label: 'Yes',
                callback: function() {
                  bootbox.dialog({
                    title: 'Submitting ...',
                    message: '<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">'
                  });

                  var stripped_notebook = function() {
                    var json = Jupyter.notebook.toJSON();

                    for (i in json.cells) {
                      if (json.cells[i].cell_type == 'code') {
                        json.cells[i].outputs = [];
                        json.cells[i].execution_count = null;
                      } else {
                        if (json.cells[i].outputs != undefined) {
                          delete json.cells[i].outputs;
                        }
                      }
                    }
                    return JSON.stringify(json);
                  }

                  $.ajax({
                    method: 'POST', 
                    dataType: 'json',
                    data: stripped_notebook(),
                    url: conf['data'].homework.url,
                    success: function(response) {
                      bootbox.hideAll();
                      bootbox.dialog({
                        title: 'Success!',
                        message: 'Your homework was successfully submitted.'
                      });
                    },
                    error: function(xhr,status,text) {
                      bootbox.hideAll();
                      bootbox.dialog({
                        title: 'Error',
                        message: 'An error occurred during submission: ' + text,
                        buttons: { cancel: { label: 'OK' } }
                      });                  
                    }
                  });
                }
              }
            }
          });
        })
      )
    );
  });
});