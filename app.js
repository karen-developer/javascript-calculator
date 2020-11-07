$(document).ready(function() {

	var num1 = [],
		num2 = [],	
		current = null,
		operator = null,
		result = null,
		objDiv = null;

	// Key click
	$(".keys").click(function () {
		var input = $(this).html();

		// Number 
		if ($(this).hasClass("num")) {
			$(".operator").removeClass("active");
			// If it's the first number or no number has been entered, push number to num1
			if (current === 1 || current === null) {
				num1.push(input);
				current = 1;
				$(".result").html(num1.join(''));
				removeClear();
			}
			// If it's the second number, push number to num2
			if (current === 2) {
				num2.push(input);
				current = 2;
				$(".result").html(num2.join(''));
				removeClear();
			}
			// If the last button was an operator, reset num2 and push number to num2
			if (current === 0) {
				num2 = [];
				num2.push(input);
				current = 2;
				$(".result").html(num2.join(''));
				removeClear();
			}
			// If the last button was equals, clear everything and push number to num1 to start again
			if (current === 3) {
				clear();
				num1.push(input);
				current = 1;
				$(".result").html(num1.join(''));
				removeClear();
			}
		} 

		// Operator 
		if ($(this).hasClass("operator")) {
			$(".operator").removeClass("active");
			// If num1 has a value do stuff. If no num1 is set, the operator shouldn't do anything
			if (num1 !== null) {
				$(this).addClass("active");
				// If the last button was an operator, just assign new operator to override it
				if (current === 0) {
					operator = input;
				}
				// If the current number is num1, set operator and add num1 to history
				if (current === 1) {
					operator = input;
					current = 0;
					$("#history p.content").append(num1.join(''));
					objDiv = document.getElementById("history");
					objDiv.scrollTop = objDiv.scrollHeight;
				}
				// If the current number is num2, two numbers and an operator already exist, so calculate previous numbers, set operator, reset num2 and move on
				if (current === 2) {
					calcResult();
					operator = input;
					current = 0;
					num2 = [];
					$("#history p.content").append(num1.join(''));
					objDiv = document.getElementById("history");
					objDiv.scrollTop = objDiv.scrollHeight;
				}
				// If the last button was equals, reset num2 to continue calculation
				if (current === 3) {
					operator = input;
					num2 = [];
					current = 0;
					$("#history p.content").append(num1.join(''));
					objDiv = document.getElementById("history");
					objDiv.scrollTop = objDiv.scrollHeight;
				}
			}
		} 

		// Equals sign 
		if ($(this).hasClass("equals")) {
			$(".operator").removeClass("active");
			// As long as there is a num1, calculate result
			if (num1 !== []) {
				calcResult();
			}
		} 

		// Clear button 
		if ($(this).hasClass("clear")) {
			// If it's all clear, clear everything
			if ($(this).hasClass("all")) {
				$(".operator").removeClass("active");
				clear();
				// it's just clear, not all clear so...
			} else {
				// Clear the current number and change state of clear button
				if (current === 1) {
					num1 = [];
					$(".result").html(0);
					addClear();
				}
				if (current === 2) {
					num2 = [];
					$(".result").html(0);
					addClear();
				}
				// If last button was an operator
				if (current === 0) {
					clear();
				}
			}
		} 

		// Plus/minus button
		if ($(this).hasClass("pm")) {
			// If current number is num1 or the equals sign (so number displayed is num1 by default) was just pressed, multiply num1 by -1
			if (current === 1 || current === 3) {
				num1 = [+num1.join('') * -1];
				$(".result").html(num1.join(''));
			}
			// If current number is num2, mult num2 by -1
			if (current === 2) {
				num2 = [+num2.join('') * -1];
				$(".result").html(num2.join(''));
			}
		} 

		// Percent button 
		if ($(this).hasClass("percent")) {
			var x = (+$(".result").text());
			// Divide current number by 100
			if (current === 1 || current === 3) {
				num1 = [x * 0.01];
				$(".result").html(num1.join(''));
			}
			if (current === 2) {
				num2 = [x * 0.01];
				$(".result").html(num2.join(''));
			}
		} 							

	}); 

	// Change behavior of clear button 
	function removeClear() {
		$(".calculator .clear").removeClass("all");
		$(".calculator .clear").html("C");
	}

	function addClear() {
		$(".calculator .clear").addClass("all");
		$(".calculator .clear").html("AC");
	} 

	// Calculate result 
	function calcResult() {
		var n1 = +num1.join('');
		var n2 = null;
		if (operator !== null) {
			// If no value for num2, make num2 equal num1 ("3+" means 3+3)
			if (current === 0) {
				n2 = n1;
			} else {
				n2 = +num2.join('');
			}
			switch (operator) {
				case '+':
				result = n1 + n2;
				break;
				case '-':
				result = n1 - n2;
				break;
				case 'x':
				result = n1 * n2;
				break;
				case '÷':
				result = n1 / n2;
				break;
			}
			// Shorten decimals and trailing zeros
			$(".result").html(formatNum(result));
			// Add result to history
			$("#history p.content").append(" " + operator + " " + n2 + "<br>= " + formatNum(result) + "<br>");
			objDiv = document.getElementById("history");
			objDiv.scrollTop = objDiv.scrollHeight;
			// Set num1 to result
			num1 = [result];
			// Keep num2 the same, in case equals is pressed again
			num2 = [n2];
			current = 3;
			addClear();
		}
	} 

	// Trim extra zeros, trim too many decimals 
	function formatNum(result) {
		return (result % 1 === 0) ? result : parseFloat(result.toFixed(8));
	} // end formatNum function

	// Clear all numbers 
	function clear() {
		num1 = [];
		num2 = [];
		operator = null;
		result = null;
		current = null;
		$(".result").html(0);
		$(".operator").removeClass("active");
		$("#history p.content").append('<hr>');
		objDiv = document.getElementById("history");
		objDiv.scrollTop = objDiv.scrollHeight;
		addClear();
	}

	// Clear history
	$("#history button.clear").click(function () {
		$("#history p.content").html("");
	});
});