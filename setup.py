from setuptools import setup, find_packages
from typing import List



def get_requirements(file_path:str)->List[str]:

    '''
    Read requirements from a file and return them as a list of strings.
    '''
    requirements = []
    with open(file_path) as file_obj:
        requirements = file_obj.readlines()
        requirements = [req.replace('\n', '') for req in requirements]


        if '-e .' in requirements:
            requirements.remove('-e .')
    return requirements

setup(

    name='project_ml',
    version='0.1.0',
    author="Reshad",
    author_email="resahdromim013@gmail.com",
    packages=find_packages(),
    install_requires=get_requirements('requirements.txt')

)