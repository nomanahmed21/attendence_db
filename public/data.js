
//Management functionality
const teacherForm = document.getElementById('teacherForm');
const studentForm = document.getElementById('studentForm');
const attendanceList = document.getElementById('attendanceList');
const showAll = document.getElementById('showAll');
const filterPresent = document.getElementById('filterPresent');
const filterAbsent = document.getElementById('filterAbsent');



// Add student
studentForm.addEventListener('submit', (e) => {
    let students = [];// It will reset the array when the form is submitted
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    students.push({ name: studentName, status: 'Absent' });
    document.getElementById('studentName').value = '';
    save_to_db(students)
    fetchAndRenderStudents()
});

// save students detail to the data base
async function save_to_db(students){
  console.log(students);
  try {
    const response = await fetch('http://localhost:5000/add-students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ students: students })
    });

    const data = await response.json();
    if (response.ok) {
        console.log('Students added:', data);
    } else {
        console.error('Error:', data.message);
    }
} catch (error) {
    console.error('Error sending request:', error);
}
};

function fetchAndRenderStudents() {
    fetch('http://localhost:5000/get-students')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            return response.json();
        })
        .then(data => {
            students = data; // Update the local students array
            renderAttendanceList(); // Render the fetched students
        })
        .catch(error => {
            console.error('Error fetching students:', error);
        });
}


// Render attendance list
function renderAttendanceList(filter = null) {
    attendanceList.innerHTML = '';
    students
        .filter(student => !filter || student.status === filter)
        .forEach((student, index) => {
            const li = document.createElement('li');
            li.className = "flex justify-between items-center p-2 border rounded-lg";
            li.innerHTML = `
                <span>${student.name}</span>
                <div>
                    <button class="bg-green-500 text-white px-3 py-1 rounded-lg mr-2" onclick="markPresent(${index})">Present</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded-lg" onclick="markAbsent(${index})">Absent</button>
                </div>
            `;
            attendanceList.appendChild(li);
        });
}

// Mark as Present
window.markPresent = (index) => {
    students[index].status = 'Present';
    renderAttendanceList();
};

// Mark as Absent
window.markAbsent = (index) => {
    students[index].status = 'Absent';
    renderAttendanceList();
};

// Show all students
showAll.addEventListener('click', () => renderAttendanceList());

// Show present students
filterPresent.addEventListener('click', () => renderAttendanceList('Present'));

// Show absent students
filterAbsent.addEventListener('click', () => renderAttendanceList('Absent'));

// document.addEventListener("DOMContentLoaded", function() {
//     console.log("DOM fully loaded and parsed!");
//     fetchAndRenderStudents();
// },{ once: true});

fetchAndRenderStudents()