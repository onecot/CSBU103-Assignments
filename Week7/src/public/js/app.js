$(document).ready(function () {
    $('#createUserForm #btn-create').click(function (event) {

        const formData = {
            username: $('#createUserForm input[name=username]').val().trim(),
            name: $('#createUserForm input[name=name]').val().trim(),
            // radios need the checked value
            gender: $('#createUserForm input[name=gender]:checked').val()
        }
        // Basic client-side validation to ensure all fields filled
        if (!formData.username || !formData.name || !formData.gender) {
            $('#createError').show().text('Please fill in all fields before submitting.')
            event.preventDefault()
            return
        }
        const userId = $('#createUserForm input[name="user_id"]').val()
        console.log(formData)
        if (!userId) {
            $.ajax({
                method: "POST",
                url: "http://localhost:3000/users",
                data: JSON.stringify(formData),
                contentType: 'application/json',
                encode: true,
            }).done(function (resp) {
                const { status, data, msg } = resp
                console.log(resp)
                if (status && data) {
                    $('#createError').hide().text('')
                    // Append row matching current table structure (no ID column)
                    $('#userList tbody').append(
                        `<tr class="user-id" data-userid="${data.id}">
                            <td class="username">${data.username}</td>
                            <td class="name">${data.name}</td>
                            <td class="gender">${data.gender}</td>
                            <td>
                              <div class="btn-group btn-group-sm" role="group">
                                <button class="update-btn btn btn-outline-primary" data-id="${data.id}">Edit</button>
                                <button class="del-btn btn btn-outline-danger" data-id="${data.id}">Delete</button>
                              </div>
                            </td>
                        </tr>`
                    )
                    // Reset form to empty after successful create
                    $('#createUserForm')[0].reset()
                    $('#createUserForm input[name="user_id"]').val('')
                    $('#createUserForm #btn-create').text('Create User')

                }
                // })
            }).fail(function(xhr){
                const resp = xhr.responseJSON || {}
                const message = resp.msg || 'Something went wrong. Please try again.'
                $('#createError').show().text(message)
            });
        } else {
            $.ajax({
                method: "PUT",
                url: `http://localhost:3000/users/${userId}`,
                data: JSON.stringify(formData),
                contentType: 'application/json',
                encode: true,
            }).done(function (resp) {
                const { status, data } = resp
                console.log(resp)
                if (status && data) {
                    // Update existing row in-place instead of re-append
                    const $row = $(`tr[data-userid="${userId}"]`)
                    $row.find('td.username').text(data.username)
                    $row.find('td.name').text(data.name)
                    $row.find('td.gender').text(data.gender)
                    // Ensure action buttons keep correct data-id
                    $row.find('button.del-btn').attr('data-id', userId)
                    $row.find('button.update-btn').attr('data-id', userId)
                    // Reset form back to create state and clear inputs
                    $('#createUserForm')[0].reset()
                    $('#createUserForm input[name="user_id"]').val('')
                    $('#createUserForm #btn-create').text('Create User')
                    $('#createError').hide().text('')

                }
                // })
            }).fail(function(xhr){
                const resp = xhr.responseJSON || {}
                const message = resp.msg || 'Could not save changes. Please try again.'
                $('#createError').show().text(message)
            });
        }


        event.preventDefault();
    })
    // Get all
    /*
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/users",
        contentType: 'application/json',
        encode: true,
    }).done(function (data) {
        console.log(data)
        data.forEach(function (val) {
            $('#userList tbody').append(
                `<tr class="user-id" data-userid="${val.id}"><td scope="row">${val.id}</td><td class="username">${val.username}</td><td class="name">${val.name}</td><td class="gender">${val.gender}</td><td><button class="del-btn btn btn-danger" data-id="${val.id}">Delete</button><button class="update-btn btn btn-warning" data-id="${val.id}">Update</button></td></tr>`
            )
        })
        $('.del-btn').click(function (e) {
            const userId = $(this).attr('data-id')
            console.log(userId)
            $.ajax({
                method: "DELETE",
                url: `http://localhost:3000/users/${userId}`,
                contentType: 'application/json',
                encode: true,
            }).done(function (resp) {
                const { status } = resp
                if (status) {
                    $(`tr[data-userid="${userId}"]`).empty();
                }
            })
        })
        $('.update-btn').click(function (e) {
            const userId = $(this).attr('data-id')
            $('#createUserForm input[name="user_id"]').val(userId)
            $('#createUserForm input[name="user_id"]').val(userId)
            $('#createUserForm input[name=username]').val($(`tr[data-userid="${userId}"] td.username`).text())
            $('#createUserForm input[name=name]').val($(`tr[data-userid="${userId}"] td.name`).text())
            $(`#createUserForm input[id="${$(`tr[data-userid="${userId}"] td.gender`).text()}"]`).attr('checked', 'true')
            $('#createUserForm #btn-create').text('Update')
        })
    });
    $('#createUserForm input[name=user_id]').change(function (e) {
        if ($('#createUserForm #btn-create').text()) {
            $('#createUserForm #btn-create').text('Update')
        } else {
            $('#createUserForm #btn-create').text('Create')

        }
    })
    */
    // Use event delegation for dynamically added rows
    $('#userList').on('click', '.del-btn', function (e) {
        const userId = $(this).attr('data-id')
        console.log(userId)
        $.ajax({
            method: "DELETE",
            url: `http://localhost:3000/users/${userId}`,
            contentType: 'application/json',
            encode: true,
        }).done(function (resp) {
            const { status } = resp
            if (status) {
                $(`tr[data-userid="${userId}"]`).empty();
            }
        })
    })
    $('#userList').on('click', '.update-btn', function (e) {
        const userId = $(this).attr('data-id')
        $('#createUserForm input[name="user_id"]').val(userId)
        $('#createUserForm input[name="user_id"]').val(userId)
        $('#createUserForm input[name=username]').val($(`tr[data-userid="${userId}"] td.username`).text())
        $('#createUserForm input[name=name]').val($(`tr[data-userid="${userId}"] td.name`).text())
        const currentGender = $(`tr[data-userid="${userId}"] td.gender`).text()
        $('#createUserForm input[name=gender]').prop('checked', false)
        $(`#createUserForm input[name=gender][id="${currentGender}"]`).prop('checked', true)
        $('#createUserForm #btn-create').text('Update User')
    })
    $('#createUserForm #btn-clear').on('click', function (e) {
        $('#createUserForm input[name="user_id"]').val('')
        $('#createUserForm input[name=username]').val('')
        $('#createUserForm input[name=name]').val('')
        $('#createUserForm input[name=gender]').prop('checked', false)
        $('#createUserForm #btn-create').text('Create User')
    })

})