/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
// (function() {
//     if (!localStorage.attendance) {
//         console.log('Creating attendance records...');
//         function getRandom() {
//             return (Math.random() >= 0.5);
//         }

//         var nameColumns = $('tbody .name-col'),
//             attendance = {};

//         nameColumns.each(function() {
//             var name = this.innerText;
//             attendance[name] = [];

//             for (var i = 0; i <= 11; i++) {
//                 attendance[name].push(getRandom());
//             }
//         });

//         localStorage.attendance = JSON.stringify(attendance);
//     }
// }());

/* ======= Model ======= */

var model = {

    currentStudent: null,

    currentAttendance: null,

    students:   [
        {
            name: 'Slappy the Frog',
            attendance: [0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0]
        },
        {
            name: 'Lilly the Lizard',
            attendance: [0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0]
        },
        {
            name: 'Paulrus the Walrus',
            attendance: [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
        },
        {
            name: 'Gregory the Goat',
            attendance: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1]
        },
        {
            name: 'Adam the Anaconda',
            attendance: [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1]
        },
        {
            name: 'Ramon Sanchez',
            attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }
    ]
};

/* ======= Octopus ======= */

var octopus = {
    init: function () {
        // Set the current student to the first one in the array.
        model.currentStudent = model.students[0];

        // Tell the view to initialize.
        studentTable.init();
        },

    getStudents: function () {
        return model.students;
    },

    getCurrentStudent: function () {
        return model.currentStudent;
    },

    getCurrentAttendance: function () {
        return model.currentAttendance;
    },

    // Set the currently selected student to the object passed in.
    setCurrentStudent: function (i) {
        model.currentStudent = model.students[i];
    },

    // Set the currently selected student to the object passed in.
    setCurrentAttendance: function (j) {
        model.currentAttendance = j;
    },

    // Add up the number of days present.
    getSum: function (total, num) {
        return total + num;
    },

    // Calculate the number of days missed.
    // Subtract the number of days present from the total days number.
    getDifference: function (i) {
        this.student = this.getStudents()[i];
        this.dayNumber = this.student.attendance.length;
        this.sum = this.student.attendance.reduce(this.getSum);
        return this.dayNumber - this.sum;
    },

    // Update the student's attendance.
    updateAttendance: function () {
        this.student = this.getCurrentStudent();
        this.j = this.getCurrentAttendance();
        if (this.student.attendance[this.j] === 0) {
            this.student.attendance[this.j] = 1;
        } else if (this.student.attendance[this.j] === 1) {
            this.student.attendance[this.j] = 0;
        };
    }
};

/* ======= View ======= */

var studentTable = {
    // Store the DOM elements for easy access later.
    init: function() {
        this.headerRow = document.getElementById('headerRow');
        this.studentRows = document.getElementById('studentRows');

        this.render();
    },

    render: function () {
        var student, studentHeader, studentRows, studentRow, studentCell;
        // Get the students to be rendered from the octopus.
        var students = octopus.getStudents();

        // Erase old header row.
        this.headerRow.innerHTML = '';

        // Create the student name column.
        studentHeader = document.createElement('th');
        studentHeader.className = 'name-col';
        studentHeader.textContent = 'Student Name';
        this.headerRow.appendChild(studentHeader);

        // Loop over day numbers.
        for (var i = 0; i < 12; i++) {
            studentHeader = document.createElement('th');
            studentHeader.textContent = i + 1;
            this.headerRow.appendChild(studentHeader);
        };

        // Create student name column
        studentHeader = document.createElement('th');
        studentHeader.className = 'missed-col';
        studentHeader.textContent = 'Days Missed';
        this.headerRow.appendChild(studentHeader);

        // Erase old student rows.
        this.studentRows.innerHTML = '';
        // loop over the student rows
        for (var i = 0; i < students.length; i++) {
            // this is the student in the current loop
            student = students[i];

            // Make a new student row and insert the name.
            studentRow = document.createElement('tr');
            studentRow.className = 'student.name';
            this.studentRows.appendChild(studentRow);

            // Create student name column.
            studentCell = document.createElement('td');
            studentCell.className = 'name-col';
            studentCell.textContent = student.name;
            studentRow.appendChild(studentCell);

            // On click, setCurrentStudent and updateAttendance.
            // (This uses a closure-in-a-loop trick to connect the
            // value of the student variable i to the click event function.)
            // This triggers after the inner loop event listener.
            studentRow.addEventListener('click', (function(event) {
                return function () {
                    octopus.setCurrentStudent(event);
                    octopus.updateAttendance();
                    studentTable.render();
                };
            })(i));

            // loop over the checkboxes
            for (var j = 0; j < 12; j++) {
                studentCell = document.createElement('td');
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                if (student.attendance[j] === 0) {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                };

                studentCell.className = 'attend-col';

                // On click, setCurrentAttendance. This happens before the
                // studentRow loop event listener.
                checkbox.addEventListener('click', (function(event) {
                    return function () {
                        octopus.setCurrentAttendance(event);
                    };
                })(j));

                // add the checkbox
                studentRow.appendChild(studentCell);
                studentCell.appendChild(checkbox);
            }; // End of checkbox loop

            // create days missed column
            studentCell = document.createElement('td');
            var daysDifference = octopus.getDifference(i);
            studentCell.className = 'missed-col';
            studentCell.textContent = daysDifference;
            studentRow.appendChild(studentCell);
        }; // End of student row loop
    }, // End of render method
};

octopus.init();

/* STUDENT APPLICATION */
// $(function() {
//     var attendance = JSON.parse(localStorage.attendance),
//         $allMissed = $('tbody .missed-col'),
//         $allCheckboxes = $('tbody input');

//     // Count a student's missed days
//     function countMissing() {
//         $allMissed.each(function() {
//             var studentRow = $(this).parent('tr'),
//                 dayChecks = $(studentRow).children('td').children('input'),
//                 numMissed = 0;

//             dayChecks.each(function() {
//                 if (!$(this).prop('checked')) {
//                     numMissed++;
//                 }
//             });

//             $(this).text(numMissed);
//         });
//     }

//     // Check boxes, based on attendace records
//     $.each(attendance, function(name, days) {
//         var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
//             dayChecks = $(studentRow).children('.attend-col').children('input');

//         dayChecks.each(function(i) {
//             $(this).prop('checked', days[i]);
//         });
//     });

//     // When a checkbox is clicked, update localStorage
//     $allCheckboxes.on('click', function() {
//         var studentRows = $('tbody .student'),
//             newAttendance = {};

//         studentRows.each(function() {
//             var name = $(this).children('.name-col').text(),
//                 $allCheckboxes = $(this).children('td').children('input');

//             newAttendance[name] = [];

//             $allCheckboxes.each(function() {
//                 newAttendance[name].push($(this).prop('checked'));
//             });
//         });

//         countMissing();
//         localStorage.attendance = JSON.stringify(newAttendance);
//     });

//     countMissing();
// }());
