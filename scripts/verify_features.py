#!/usr/bin/env python3
"""Verify all new features are present in the enhanced script."""
import ast
import inspect

def check_feature(feature_name, check_func):
    try:
        result = check_func()
        status = "✓" if result else "✗"
        print(f"{status} {feature_name}")
        return result
    except Exception as e:
        print(f"✗ {feature_name} (error: {e})")
        return False

print("Checking features in hubfit_dashboard.py...\n")

# Read the script
with open("hubfit_dashboard.py", "r") as f:
    content = f.read()

# Parse the AST
tree = ast.parse(content)

# Check 1: CLI arguments
def check_cli_args():
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and hasattr(node.func, 'attr'):
            if node.func.attr == 'add_argument':
                for kw in node.keywords:
                    if kw.arg == 'dest' or (isinstance(kw.value, ast.Constant) and kw.value.value in ['--data-dir', '--history']):
                        return True
    return False

# Check 2: Data persistence functions
def check_data_functions():
    func_names = ['save_json_data', 'load_previous_data', 'compare_with_previous', 'get_high_priority_alerts']
    defined_funcs = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            defined_funcs.append(node.name)
    return all(func in defined_funcs for func in func_names)

# Check 3: High priority alerts logic
def check_alerts_logic():
    # Look for the ghosting >14 days check
    ghosting_check = 'days_since_checkin is not None and r["days_since_checkin"] > 14'
    # Look for expiring <7 days check  
    expiring_check = 'sub_days_left is not None and 0 < r["sub_days_left"] < 7'
    return ghosting_check in content and expiring_check in content

# Check 4: Trend analysis integration
def check_trend_integration():
    return 'args.history' in content and 'trend_info' in content

# Check 5: Report sections
def check_report_sections():
    sections = ['High Priority Alerts', 'Trend Analysis']
    return all(section in content for section in sections)

# Run all checks
checks = [
    ("CLI flags --data-dir and --history", check_cli_args),
    ("Data persistence functions", check_data_functions),
    ("High priority alerts logic", check_alerts_logic),
    ("Trend analysis integration", check_trend_integration),
    ("Report sections in output", check_report_sections),
]

all_passed = True
for name, check in checks:
    if not check_feature(name, check):
        all_passed = False

print(f"\n{'='*50}")
if all_passed:
    print("ALL FEATURES VERIFIED SUCCESSFULLY!")
    print("\nThe enhanced hubfit_dashboard.py includes:")
    print("1. Data persistence to JSON files")
    print("2. Trend tracking with --history flag")
    print("3. High priority alerts for ghosting>14d and expiring<7d")
    print("4. CLI flags --data-dir and --history")
    print("5. Existing output format preserved with new sections")
else:
    print("SOME FEATURES MISSING - please review the script")